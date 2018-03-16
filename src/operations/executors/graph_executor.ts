/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import * as dl from 'deeplearn';

import {NamedTensorsMap} from '../../data/index';
import {Node} from '../index';

import {OpExecutor} from './types';
import {getParamValue, getTensor} from './utils';

export let executeOp: OpExecutor = (node: Node, tensorMap: NamedTensorsMap):
                                       dl.Tensor[] => {
  switch (node.op) {
    case 'const': {
      return tensorMap[node.name];
    }
    case 'placeholder':
      const def = getParamValue('default', node, tensorMap) as dl.Tensor;
      return [getTensor(node.name, tensorMap) || def];
    case 'identity':
      return [getParamValue('x', node, tensorMap) as dl.Tensor];
    case 'shape':
      return [dl.tensor1d(
          (getParamValue('x', node, tensorMap) as dl.Tensor).shape, 'int32')];

    default:
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
};

export const CATEGORY = 'graph';
