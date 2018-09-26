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

import {Optimizer} from '../../data/types';
import {getNodeNameAndIndex} from '../../operations/executors/utils';
import {Backends, Graph} from '../../operations/types';

const CPU_OPS = new Set(['rank', 'shape', 'size', 'loopCond']);

/**
 * Optimizer for allocating ops to browser backends (webgl, cpu).
 * It uses following heuristics when designate an op to a particular backend:
 *  1. If any of the inputs is on webgl the op will be executed on webgl.
 *  2. If all of the inputs are on cpu th eop will be executed on cpu.
 *  3. Always allocate CPU optimized ops to cpu execution.
 *  4. User can specify the allocation for the input nodes.
 */
export class DeviceAllocationOptimizer implements Optimizer {
  constructor(private inputBackend: Backends = 'webgl') {}

  /**
   * device allocation of the nodes in the input graph.
   * @param graph the graph of the model
   */
  public optimize(graph: Graph): Graph {
    const inputs = graph.placeholders;

    const stack = [...inputs, ...graph.weights];
    const visited: {[key: string]: boolean} = {};
    let cpuCount = 0;
    let gpuCount = 0;
    while (stack.length > 0) {
      const node = stack.pop();
      visited[node.name] = true;

      // device allocation based on input locations
      if (node.inputs.every(input => input.backend === 'cpu')) {
        node.backend = 'cpu';
      } else {
        node.backend = 'webgl';
      }

      // device allocation based on op preference
      if (node.op === 'placeholder') {
        node.backend = this.inputBackend;
      } else if (CPU_OPS.has(node.op)) {
        node.backend = 'cpu';
      }

      if (node.backend === 'cpu') {
        cpuCount += 1;
      } else {
        gpuCount += 1;
      }
      node.children.forEach((childNode) => {
        if (!visited[childNode.name] &&
            (childNode.op === 'merge' && childNode.inputNames.some(name => {
              const [nodeName, ] = getNodeNameAndIndex(name);
              return visited[nodeName];
            }) ||
             childNode.inputNames.every(name => {
               const [nodeName, ] = getNodeNameAndIndex(name);
               return visited[nodeName];
             }))) {
          stack.push(childNode);
        }
      });
    }

    console.log('gpu nodes =', gpuCount);
    console.log('cpu nodes =', cpuCount);
    console.log('non-constant cpu nodes =', cpuCount - graph.weights.length);
    return graph;
  }
}
