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

import {ExecutionContext} from './execution_context';

export class GraphExecutor {
  private compiledOrder: operations.Node[] = [];
  private _weightMap: NamedTensorsMap = {};
  private context: ExecutionContext = new ExecutionContext();
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
              const [nodeName, ] = getNodeNameAndIndex(name, this);
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
    this.context.reset();
    const result = tidy(() => {
      let tensors = {};
      if (this.graph.withControlFlow) {
        tensors = this.executeWithControlFlow(inputs);
      } else {
        tensors = this.compiledOrder.reduce<NamedTensorsMap>((map, node) => {
          map[node.name] = operations.executeOp(node, map, this);
          return map;
        }, {...this.weightMap, ...inputs});
      }

      if (outputs && !(outputs instanceof Array)) {
        outputs = [outputs];
      }
      const requestedOutputs =
          (outputs || this.graph.outputs.map(node => node.name)) as string[];

      return requestedOutputs.reduce<NamedTensorMap>((map, name) => {
        map[name] = getTensor(name, tensors, this);
        return map;
      }, {});
    });
    return result;
  }

  private executeWithControlFlow(inputs: NamedTensorsMap): NamedTensorsMap {
    const stack = [...this.graph.inputs];
    const tensorMap = {...this.weightMap, ...inputs};
    const visited: {[key: string]: boolean} = {};

    while (stack.length > 0) {
      const node = stack.pop();
      const tensors = operations.executeOp(node, tensorMap, this);
      const [nodeName, ] = getNodeNameAndIndex(node.name, this);
      tensorMap[nodeName] = tensors;
      visited[nodeName] = true;
      node.children.forEach((childNode) => {
        const [nodeName, ] = getNodeNameAndIndex(childNode.name, this);
        if (!visited[nodeName]) {
          // Merge op can be pushed if any of its inputs has value.
          if (childNode.op === 'merge') {
            if (childNode.inputNames.some(
                    name => !!getTensor(name, tensorMap, this))) {
              stack.push(childNode);
            }
            // Otherwise all inputs need to have value.
          } else if (childNode.inputNames.every(
                         name => !!getTensor(name, tensorMap, this))) {
            stack.push(childNode);
          }
        }
      });
    }

    return tensorMap;
  }

  get currentContextId(): string {
    return this.context.currentContextId;
  }

  enterFrame(frameId: string) {
    this.context.enterFrame(frameId);
  }

  exitFrame() {
    this.context.exitFrame();
  }

  nextIteration() {
    this.context.nextIteration();
  }

  getWeight(name: string): Tensor[] {
    return this.weightMap[name];
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
