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

import {tidy} from '@tensorflow/tfjs-core';

import {NamedTensorMap, NamedTensorsMap} from '../data/index';
import {getNodeNameAndIndex, getTensor} from '../operations/executors/utils';
import * as operations from '../operations/index';
import {Node} from '../operations/index';

import {ExecutionContext, ExecutionContextId} from './execution_context';

interface NodeWithContextId {
  node: Node;
  contexts: ExecutionContextId[];
}

export class GraphExecutor {
  private compiledOrder: operations.Node[] = [];
  private _weightMap: NamedTensorsMap = {};
  get weightMap(): NamedTensorsMap {
    return this._weightMap;
  }
  set weightMap(weightMap: NamedTensorsMap) {
    this._weightMap = weightMap;
  }

  constructor(private graph: operations.Graph) {
    this.compile();
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
      let tensors = {};
      const context = new ExecutionContext(this._weightMap);
      // Graph with control flow op requires runtime evaluation of the execution
      // order, while without control flow the execution order is pre-determined
      // in the compile method.
      if (this.graph.withControlFlow) {
        tensors = this.executeWithControlFlow(inputs, context);
      } else {
        tensors = this.compiledOrder.reduce<NamedTensorsMap>((map, node) => {
          map[node.name] = operations.executeOp(node, map, context);
          return map;
        }, {...this.weightMap, ...inputs});
      }

      if (outputs && !(outputs instanceof Array)) {
        outputs = [outputs];
      }
      const requestedOutputs =
          (outputs || this.graph.outputs.map(node => node.name)) as string[];

      return requestedOutputs.reduce<NamedTensorMap>((map, name) => {
        map[name] = getTensor(name, tensors, context);
        return map;
      }, {});
    });
    return result;
  }

  /**
   * When there are control flow nodes in the graph, the graph execution use
   * ExecutionContext to keep track of the frames and loop iterators.
   * @param inputs placeholder tensors for the graph.
   * @param context the execution context object for current execution.
   */
  private executeWithControlFlow(
      inputs: NamedTensorsMap, context: ExecutionContext): NamedTensorsMap {
    context.initializeContext(this.graph.inputs);
    const stack: NodeWithContextId[] = this.graph.inputs.map(input => {
      return {contexts: context.contextIdMap[input.name], node: input};
    });
    const tensorMap = {...this.weightMap, ...inputs};
    const visited: {[key: string]: boolean} = {};
    while (stack.length > 0) {
      const item = stack.pop();
      context.currentContext = item.contexts;

      const tensors = operations.executeOp(item.node, tensorMap, context);

      const [nodeName, ] = getNodeNameAndIndex(item.node.name, context);
      tensorMap[nodeName] = tensors;
      visited[nodeName] = true;

      item.node.children.forEach((childNode) => {
        // the child node always use the first input's context id
        const index = childNode.inputs.findIndex(input => input === item.node);
        if (index === 0) {
          context.contextIdMap[childNode.name] = context.currentContext;
        }

        const [nodeName, ] = getNodeNameAndIndex(childNode.name, context);
        if (childNode.op === 'nextIteration' || !visited[nodeName]) {
          // Merge op can be pushed if any of its inputs has value.
          if (childNode.op === 'merge') {
            if (childNode.inputNames.some(
                    name => !!getTensor(name, tensorMap, context))) {
              stack.push({
                contexts: context.contextIdMap[childNode.name],
                node: childNode
              });
            }
          } else  // Otherwise all inputs must to have value.
              if (childNode.inputNames.every(
                      name => !!getTensor(name, tensorMap, context))) {
            stack.push({
              contexts: context.contextIdMap[childNode.name],
              node: childNode
            });
          }
        }
      });
    }

    return tensorMap;
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
