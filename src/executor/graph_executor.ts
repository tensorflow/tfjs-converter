/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {DataType, Tensor, tidy, util} from '@tensorflow/tfjs-core';
import {NamedTensorMap, NamedTensorsMap, TensorArrayMap, TensorInfo} from '../data/types';
import {getNodeNameAndIndex, getParamValue, getTensor, getTensorsForCurrentContenxt, parseNodeName} from '../operations/executors/utils';
import {executeOp} from '../operations/operation_executor';
import {Graph, Node} from '../operations/types';

import {ExecutionContext, ExecutionContextInfo} from './execution_context';

interface NodeWithContexts {
  contexts: ExecutionContextInfo[];
  node: Node;
}

const CONTROL_FLOW_OPS = ['Switch', 'Merge', 'Enter', 'Exit', 'NextIteration'];
const DYNAMIC_SHAPE_OPS =
    ['NonMaxSuppressionV2', 'NonMaxSuppressionV3', 'Where'];

function isControlFlow(node: Node) {
  return CONTROL_FLOW_OPS.indexOf(node.op) >= 0;
}

function isDynamicShape(node: Node) {
  return DYNAMIC_SHAPE_OPS.indexOf(node.op) >= 0;
}

export class GraphExecutor {
  private compiledMap: Map<string, Node[]> = new Map();
  private _weightMap: NamedTensorsMap = {};
  private weightIds: number[];
  private placeholders: Node[];
  private _outputs: Node[];
  private SEPERATOR = ',';
  get weightMap(): NamedTensorsMap {
    return this._weightMap;
  }
  set weightMap(weightMap: NamedTensorsMap) {
    const weightIds = Object.keys(weightMap).map(
        key => weightMap[key].map(tensor => tensor.id));
    this.weightIds = [].concat.apply([], weightIds);
    this._weightMap = weightMap;
  }

  get inputs(): TensorInfo[] {
    return this.placeholders.map(node => {
      return {
        name: node.name,
        shape: node.attrParams['shape'] ?
            node.attrParams['shape'].value as number[] :
            undefined,
        dtype: node.attrParams['dtype'] ?
            node.attrParams['dtype'].value as DataType :
            undefined
      };
    });
  }

  get outputs(): TensorInfo[] {
    return this._outputs.map(node => {
      return {
        name: node.name,
        shape: node.attrParams['shape'] ?
            node.attrParams['shape'].value as number[] :
            undefined,
        dtype: node.attrParams['dtype'] ?
            node.attrParams['dtype'].value as DataType :
            undefined
      };
    });
  }

  get inputNodes(): string[] {
    return this.placeholders.map(node => node.name);
  }

  get outputNodes(): string[] {
    return this.outputs.map(node => node.name);
  }

  constructor(private graph: Graph) {
    this.placeholders = graph.placeholders;
    this._outputs = graph.outputs;
  }

  /**
   * Compiles the inference graph to generate the topology order of op nodes,
   * cache the result for inference execution.
   */
  private compile(inputs: Node[], outputs: Node[]) {
    const sortedInputs = inputs.map(node => node.name).sort();
    const sortedOutputs = outputs.map(node => node.name).sort();
    const nameKey = sortedInputs.join(this.SEPERATOR) + '--' +
        sortedOutputs.join(this.SEPERATOR);

    // do nothing if the compiled graph cache contains the input.
    if (this.compiledMap.get(nameKey)) {
      return;
    }

    // Start with the outputs, going backwards and find all the nodes that are
    // needed to compute those outputs.
    const needed: string[] = [];
    let seen = new Set<string>();
    let frontier = [...outputs];
    const nodesToCompute = new Set<string>();
    while (frontier.length > 0) {
      const node = frontier.pop();
      if (isControlFlow(node) || isDynamicShape(node)) {
        const reason =
            isControlFlow(node) ? 'control flow' : 'dynamic output shape';
        const alternativeInputs = node.children.map(child => child.name)
                                      .filter(name => nodesToCompute.has(name));
        throw new Error(
            `The model contains the node '${node.name}', which has the ` +
            `${reason} op '${node.op}'. Please use model.executeAsync(). ` +
            `Alternatively specify the nodes that come after this node ` +
            `as inputs: [${alternativeInputs}].`);
      }
      nodesToCompute.add(node.name);

      // Weights are dead end since we already have their values.
      if (this.weightMap[node.name] != null) {
        continue;
      }
      // This node is a dead end since it's one of the user-provided inputs.
      if (inputs.some(input => input.name === node.name)) {
        continue;
      }
      if (node.inputs.length === 0) {
        needed.push(node.name);
        continue;
      }
      node.inputs.forEach(input => {
        // Don't add to the frontier if it is already there.
        if (seen.has(input.name)) {
          return;
        }
        seen.add(input.name);
        frontier.push(input);
      });
    }
    if (needed.length > 0) {
      const outNames = outputs.map(n => n.name);
      const inNames = inputs.map(n => n.name);
      throw new Error(
          `Cannot compute the outputs [${outNames}] from the provided inputs ` +
          `[${inNames}]. Missing the following inputs: [${needed}]`);
    }

    // Above, we guaranteed that the output can be computed from the provided
    // inputs. Now start from the inputs, going forward in order to get a
    // topological order.
    frontier = [];
    inputs.forEach(input => {
      if (nodesToCompute.has(input.name)) {
        frontier.push(input);
      }
    });
    this.graph.weights.forEach(weight => {
      if (nodesToCompute.has(weight.name)) {
        frontier.push(weight);
      }
    });
    seen = new Set<string>();
    const compiledOrder: Node[] = [];
    while (frontier.length > 0) {
      const node = frontier.pop();
      seen.add(node.name);
      if (!this.weightMap[node.name]) {
        compiledOrder.push(node);
      }
      node.children.forEach(child => {
        if (!seen.has(child.name) && nodesToCompute.has(child.name) &&
            child.inputs.every(input => seen.has(input.name))) {
          frontier.push(child);
        }
      });
    }
    this.compiledMap.set(nameKey, compiledOrder);
  }

  /**
   * Executes the inference for given input tensors.
   * @param inputs Tensor map for the model inputs, keyed by the input node
   * names.
   * @param outputs output node name from the Tensorflow model, if no outputs
   * are specified, the default outputs of the model would be used. You can
   * inspect intermediate nodes of the model by adding them to the outputs
   * array.
   */
  execute(inputs: NamedTensorsMap, outputs: string[]): NamedTensorMap {
    const names = Object.keys(inputs).sort();
    this.checkInputs(inputs);
    this.checkInputShapeAndType(inputs);
    this.checkOutputs(outputs);
    const outputNodes =
        outputs.map(name => this.graph.nodes[parseNodeName(name)[0]]);
    this.compile(names.map(name => this.graph.nodes[name]), outputNodes);
    const tensorArrayMap: TensorArrayMap = {};
    const result = tidy(() => {
      const context = new ExecutionContext(this._weightMap, tensorArrayMap);
      const tensorMap = {...this.weightMap, ...inputs};
      const tensorsToKeep = this.getFrozenTensorIds(tensorMap);
      const intermediateTensorConsumerCount: {[key: number]: number} = {};

      const compiledNodes = this.compiledMap.get(names.join(this.SEPERATOR));
      for (let i = 0; i < compiledNodes.length; i++) {
        const node = compiledNodes[i];
        if (!tensorMap[node.name]) {
          const tensors = executeOp(node, tensorMap, context) as Tensor[];
          if (tensors instanceof Promise) {
            console.warn('Should not happen');
          }
          tensorMap[node.name] = tensors;
          this.checkTensorForDisposal(
              node.name, node, tensorMap, context, tensorsToKeep, outputs,
              intermediateTensorConsumerCount);
        }
      }
      return this.findOutputs(tensorMap, context, outputs);
    });
    return result;
  }

  private getFrozenTensorIds(tensorMap: NamedTensorsMap): Set<number> {
    const ids = [].concat.apply(
        [],
        Object.keys(tensorMap)
            .map(key => tensorMap[key])
            .map(tensors => tensors.map(tensor => tensor.id)));
    return new Set(ids);
  }
  private checkTensorForDisposal(
      nodeName: string, node: Node, tensorMap: NamedTensorsMap,
      context: ExecutionContext, tensorsToKeep: Set<number>,
      outputNames: string[],
      intermediateTensorConsumerCount: {[key: string]: number}) {
    // Skip output nodes and any control flow nodes, since its dependency is
    // tricky to track correctly.
    if (node.category === 'control' || outputNames.indexOf(nodeName) !== -1) {
      return;
    }

    tensorMap[nodeName].forEach(tensor => {
      if (tensor != null) {
        intermediateTensorConsumerCount[tensor.id] =
            (intermediateTensorConsumerCount[tensor.id] || 0) +
            node.children.length;
      }
    });
    node.inputs.forEach(input => {
      // Skip any control flow nodes, since its dependency is tricky to track
      // correctly.
      if (input.category !== 'control') {
        const tensors =
            getTensorsForCurrentContenxt(input.name, tensorMap, context);
        if (tensors != null) {
          tensors.forEach(tensor => {
            if (tensor && !tensorsToKeep.has(tensor.id)) {
              const count = intermediateTensorConsumerCount[tensor.id];
              if (count === 1) {
                tensor.dispose();
                delete intermediateTensorConsumerCount[tensor.id];
              } else if (count != null) {
                // only intermediate nodes has count set, inputs and weights are
                // not.
                intermediateTensorConsumerCount[tensor.id]--;
              }
            }
          });
        }
      }
    });
  }
  /**
   * Executes the inference for given input tensors in Async fashion.
   * @param inputs Tensor map for the model inputs, keyed by the input node
   * names.
   * @param outputs output node name from the Tensorflow model, if no outputs
   * are specified, the default outputs of the model would be used. You can
   * inspect intermediate nodes of the model by adding them to the outputs
   * array.
   */
  async executeAsync(inputs: NamedTensorsMap, outputs: string[]):
      Promise<NamedTensorMap> {
    this.checkInputs(inputs);
    this.checkInputShapeAndType(inputs);
    const tensorArrayMap: TensorArrayMap = {};
    const context = new ExecutionContext(this._weightMap, tensorArrayMap);
    // Graph with control flow op requires runtime evaluation of the execution
    // order, while without control flow the execution order is pre-determined
    // in the compile method.
    const tensors = await this.executeWithControlFlow(inputs, context, outputs);
    const results = this.findOutputs(tensors, context, outputs);

    // dispose all the intermediate tensors
    const outputIds = Object.keys(results).map(key => results[key].id);
    const inputIdArray =
        Object.keys(inputs).map(key => inputs[key].map(input => input.id));
    const inputIds = [].concat.apply([], inputIdArray);
    Object.keys(tensors).forEach(key => {
      const tensorArray = tensors[key];
      tensorArray.forEach(tensor => {
        if (tensor && !tensor.isDisposed &&
            outputIds.indexOf(tensor.id) === -1 &&
            inputIds.indexOf(tensor.id) === -1 &&
            this.weightIds.indexOf(tensor.id) === -1) {
          tensor.dispose();
        }
      });
    });
    return results;
  }

  /**
   * When there are control flow nodes in the graph, the graph execution use
   * ExecutionContext to keep track of the frames and loop iterators.
   * @param inputs placeholder tensors for the graph.
   * @param context the execution context object for current execution.
   */
  private async executeWithControlFlow(
      inputs: NamedTensorsMap, context: ExecutionContext,
      outputNames: string[]): Promise<NamedTensorsMap> {
    const names = Object.keys(inputs);
    const inputNodes = names.map(name => this.graph.nodes[name]);
    const stack: NodeWithContexts[] =
        [...inputNodes, ...this.graph.weights].map(node => {
          return {node, contexts: context.currentContext};
        });
    const tensorMap = {...this.weightMap, ...inputs};
    const intermediateTensorConsumerCount: {[key: number]: number} = {};
    const tensorsToKeep = this.getFrozenTensorIds(tensorMap);
    const added: {[key: string]: boolean} = {};
    let hasControlFlowOrDynamicShape = false;
    while (stack.length > 0) {
      const item = stack.pop();
      context.currentContext = item.contexts;
      let nodeName = '';
      // The tensor of the Enter op with isConstant set should be set
      // in the parent scope, so it will be available as constant for the
      // whole loop.
      if (item.node.op === 'Enter' &&
          getParamValue('isConstant', item.node, tensorMap, context)) {
        [nodeName] = getNodeNameAndIndex(item.node.name, context);
      }

      // only process nodes that are not provided as input nodes.
      if (inputNodes.indexOf(item.node) === -1) {
        if (isControlFlow(item.node) || isDynamicShape(item.node)) {
          hasControlFlowOrDynamicShape = true;
        }
        let tensors = executeOp(item.node, tensorMap, context);
        if (!nodeName) {
          [nodeName] = getNodeNameAndIndex(item.node.name, context);
        }
        if (tensors instanceof Promise) {
          tensors = await tensors;
        }
        tensorMap[nodeName] = tensors;
        this.checkTensorForDisposal(
            nodeName, item.node, tensorMap, context, tensorsToKeep, outputNames,
            intermediateTensorConsumerCount);
      }
      this.processChildNodes(item.node, stack, context, tensorMap, added);
    }
    if (!hasControlFlowOrDynamicShape) {
      console.warn(
          `This model execution did not contain any nodes with control flow ` +
          `or dynamic output shapes. You can use model.execute()
          instead.`);
    }
    return tensorMap;
  }

  private processChildNodes(
      node: Node, stack: NodeWithContexts[], context: ExecutionContext,
      tensorMap: NamedTensorsMap, added: {[key: string]: boolean}) {
    node.children.forEach((childNode) => {
      const [nodeName, ] = getNodeNameAndIndex(childNode.name, context);
      if (!added[nodeName]) {
        // Merge op can be pushed if any of its inputs has value.
        if (childNode.op === 'Merge') {
          if (childNode.inputNames.some(name => {
                return !!getTensor(name, tensorMap, context);
              })) {
            added[nodeName] = true;
            stack.push({contexts: context.currentContext, node: childNode});
          }
        } else  // Otherwise all inputs must to have value.
            if (childNode.inputNames.every(name => {
                  return !!getTensor(name, tensorMap, context);
                })) {
          added[nodeName] = true;
          stack.push({contexts: context.currentContext, node: childNode});
        }
      }
    });
  }

  private findOutputs(
      tensorMap: NamedTensorsMap, context: ExecutionContext,
      outputs: string[]): NamedTensorMap {
    return outputs.reduce<NamedTensorMap>((map, name) => {
      map[name] = getTensor(name, tensorMap, context);
      return map;
    }, {});
  }
  /**
   * Releases the memory used by the weight tensors.
   */
  dispose() {
    Object.keys(this.weightMap)
        .forEach(
            key => this.weightMap[key].forEach(tensor => tensor.dispose()));
  }

  private checkInputShapeAndType(inputs: NamedTensorsMap) {
    Object.keys(inputs).forEach(name => {
      const input = inputs[name][0];
      const node = this.graph.nodes[name];
      if (node.attrParams['shape'] && node.attrParams['shape'].value) {
        const shape = node.attrParams['shape'].value as number[];
        const match = shape.length === input.shape.length &&
            input.shape.every(
                (dim, index) => shape[index] === -1 || shape[index] === dim);
        util.assert(
            match,
            () => `The shape of dict['${node.name}'] provided in ` +
                `model.execute(dict) must be [${shape}], but was ` +
                `[${input.shape}]`);
      }
      if (node.attrParams['dtype'] && node.attrParams['dtype'].value) {
        util.assert(
            input.dtype === node.attrParams['dtype'].value as string,
            () => `The dtype of dict['${node.name}'] provided in ` +
                `model.execute(dict) must be ` +
                `${node.attrParams['dtype'].value}, but was ${input.dtype}`);
      }
    });
  }

  private checkInputs(inputs: NamedTensorsMap) {
    const notInGraph =
        Object.keys(inputs).filter(name => !this.graph.nodes[name]);
    if (notInGraph.length > 0) {
      throw new Error(
          `The dict provided in model.execute(dict) has ` +
          `keys: [${notInGraph}] that are not part of graph`);
    }
  }

  private checkOutputs(outputs: string[]): void {
    outputs.forEach(name => {
      const [normalizedName] = parseNodeName(name);
      if (!this.graph.nodes[normalizedName]) {
        throw new Error(`The output '${name}' is not found in the graph`);
      }
    });
  }
}
