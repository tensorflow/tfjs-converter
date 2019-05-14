/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import {Tensor} from '@tensorflow/tfjs-core';

import {IAttrValue} from '../../data/compiled_api';
import {NamedTensorsMap} from '../../data/types';
import {ExecutionContext} from '../../executor/execution_context';
import {getTensor} from '../executors/utils';
import {Node, NodeValue} from '../types';

/**
 * Helper class for lookup inputs and params for nodes in the model graph.
 */
export class NodeValueImpl implements NodeValue {
  constructor(
      private node: Node, private tensorMap: NamedTensorsMap,
      private context: ExecutionContext) {}

  /**
   * Return the value of the attribute or input param.
   * @param name String: name of attribute or input param.
   */
  getInput(index: number): Tensor {
    return getTensor(this.node.inputNames[index], this.tensorMap, this.context);
  }

  /**
   * Return the value of the attribute or input param.
   * @param name String: name of attribute or input param.
   */
  getAttr(name: string): IAttrValue|Tensor {
    const value = this.node.rawAttrs[name];
    if (value.tensor != null) {
      return getTensor(name, this.tensorMap, this.context);
    }
    return value;
  }
}
