/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {Tensor, tidy} from '@tensorflow/tfjs-core';

import {NamedTensorMap, NamedTensorsMap} from '../data/index';
import {getNodeNameAndIndex, getTensor} from '../operations/executors/utils';
import * as operations from '../operations/index';
import {Node} from '../operations/index';

import {ExecutionContext} from './execution_context';

export class GraphExecutor {
  private compiledOrder: operations.Node[] = [];
  private _weightMap: NamedTensorsMap = {};
  private weightIds: number[];
  get weightMap(): NamedTensorsMap {
    return this._weightMap;
  }
  set weightMap(weightMap: NamedTensorsMap) {
    const weightIds = Object.keys(weightMap).map(
        key => weightMap[key].map(tensor => tensor.id));
    this.weightIds = [].concat.apply([], weightIds);
    this._weightMap = weightMap;
  }

  constructor(private graph: operations.Graph) {
    this.compile();
  }

  get isControlFlowModel(): boolean {
    return this.graph.withControlFlow;
  }

  /**
   * Compiles the inference graph to generate the topology order of op nodes,
   * cache the result for inference execution.
   */
  private compile() {
    // Do not compile for graph with control flow, since the execution order
    // requires runtime evaluation of the output tensors.
    if (this.graph.withControlFlow) {
      return;
    }

    const stack = [...this.graph.inputs];
    const visited: {[key: string]: boolean} = {};
    while (stack.length > 0) {
      const node = stack.pop();
      visited[node.name] = true;
      this.compiledOrder.push(node);
      node.children.forEach((childNode) => {
        if (!visited[childNode.name] && childNode.inputNames.every(name => {
              const [nodeName, ] = getNodeNameAndIndex(name);
              return visited[nodeName];
            })) {
          stack.push(childNode);
        }
      });
    }
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
  execute(inputs: NamedTensorsMap, outputs?: string|string[]): NamedTensorMap {
    const result = tidy(() => {
      const context = new ExecutionContext(this._weightMap);
      const tensors =
          this.compiledOrder.reduce<NamedTensorsMap>((map, node) => {
            map[node.name] =
                operations.executeOp(node, map, context) as Tensor[];
            return map;
          }, {...this.weightMap, ...inputs});
      return this.findOutputs(tensors, context, outputs);
    });
    return result;
  }

  async executeAsync(inputs: NamedTensorsMap, outputs?: string|string[]):
      Promise<NamedTensorMap> {
    const context = new ExecutionContext(this._weightMap);
    // Graph with control flow op requires runtime evaluation of the execution
    // order, while without control flow the execution order is pre-determined
    // in the compile method.
    const tensors = await this.executeWithControlFlow(inputs, context);
    const results = this.findOutputs(tensors, context, outputs);

    // dispose all tensors that are not part of the outputs and weights
    const outputIds = Object.keys(results).map(key => results[key].id);
    const inputIdArray =
        Object.keys(inputs).map(key => inputs[key].map(input => input.id));
    const inputIds = [].concat.apply([], inputIdArray);
    Object.keys(tensors).forEach(key => {
      const tensorArray = tensors[key];
      tensorArray.forEach(tensor => {
        if (tensor && outputIds.indexOf(tensor.id) === -1 &&
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
      inputs: NamedTensorsMap,
      context: ExecutionContext): Promise<NamedTensorsMap> {
    context.initializeContext(this.graph.inputs);
    const stack: Node[] = this.graph.inputs.slice();
    const tensorMap = {...this.weightMap, ...inputs};
    const visited: {[key: string]: boolean} = {};
    while (stack.length > 0) {
      const node = stack.shift();
      context.currentNode = node;
      const tensors = operations.executeOp(node, tensorMap, context);

      const [nodeName, ] = getNodeNameAndIndex(node.name, context);
      tensorMap[nodeName] = await tensors;
      visited[nodeName] = true;

      const originalContext = context.currentContext;
      node.children.forEach((childNode) => {
        context.currentContext = originalContext;
        if (!context.contextIdMap[childNode.name]) {
          context.contextIdMap[childNode.name] = {};
        }
        context.contextIdMap[childNode.name][node.name] =
            context.currentContext;

        const [nodeName, ] = getNodeNameAndIndex(childNode.name, context);
        if (childNode.op === 'nextIteration' || !visited[nodeName]) {
          // context.currentNode = childNode;
          // Merge op can be pushed if any of its inputs has value.
          if (childNode.op === 'merge') {
            if (childNode.inputNames.some(name => {
                  return !!getTensor(name, tensorMap, context);
                })) {
              context.contextIdMap[childNode.name]['last'] =
                  context.currentContext;
              stack.push(childNode);
            }
          } else  // Otherwise all inputs must to have value.
              if (childNode.inputNames.every(name => {
                    return !!getTensor(name, tensorMap, context);
                  })) {
            context.contextIdMap[childNode.name]['last'] =
                context.currentContext;
            stack.push(childNode);
          }
        }
      });
    }

    return tensorMap;
  }

  private findOutputs(
      tensorMap: NamedTensorsMap, context: ExecutionContext,
      outputs?: string|string[]): NamedTensorMap {
    if (outputs && !(outputs instanceof Array)) {
      outputs = [outputs];
    }
    const requestedOutputs =
        (outputs || this.graph.outputs.map(node => node.name)) as string[];

    return requestedOutputs.reduce<NamedTensorMap>((map, name) => {
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
}
