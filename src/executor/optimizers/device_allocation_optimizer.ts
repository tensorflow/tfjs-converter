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
import {Graph} from '../../operations/types';

const CPU_OPS = new Set(['const', 'rank', 'shape', 'size']);

export class DeviceAllocationOptimizer implements Optimizer {
  public optimize(graph: Graph): Graph {
    const inputs = graph.placeholders;

    const stack = [...inputs, ...graph.weights];
    const visited: {[key: string]: boolean} = {};
    while (stack.length > 0) {
      const node = stack.pop();
      visited[node.name] = true;

      if (node.op === 'placeholder') {
        node.backend = 'webgl';
      } else if (CPU_OPS.has(node.op)) {
        node.backend = 'cpu';
      }

      if (node.inputs.some(
              input => !!input.backend && input.backend === 'webgl')) {
        node.backend = 'webgl';
      }

      node.children.forEach((childNode) => {
        if (!visited[childNode.name] && childNode.inputNames.every(name => {
              const [nodeName, ] = getNodeNameAndIndex(name);
              return visited[nodeName];
            })) {
          stack.push(childNode);
        }
      });
    }
    return graph;
  }
}
