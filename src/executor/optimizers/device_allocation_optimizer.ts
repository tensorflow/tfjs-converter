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

export class DeviceAllocationOptimizer implements Optimizer {
  constructor(private inputBackend: Backends = 'webgl') {}
  public optimize(graph: Graph): Graph {
    const inputs = graph.placeholders;

    const stack = [...inputs, ...graph.weights];
    const visited: {[key: string]: boolean} = {};
    let cpuCount = 0;
    let gpuCount = 0;
    while (stack.length > 0) {
      const node = stack.pop();
      visited[node.name] = true;

      if (node.inputs.every(input => input.backend === 'cpu')) {
        node.backend = 'cpu';
        cpuCount += 1;
      } else {
        node.backend = 'webgl';
        gpuCount += 1;
      }

      if (node.op === 'placeholder') {
        node.backend = this.inputBackend;
      } else if (CPU_OPS.has(node.op)) {
        node.backend = 'cpu';
        cpuCount += 1;
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
