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

export let executeOp: OpExecutor =
    (node: Node, tensorMap: NamedTensorsMap): dl.Tensor[] => {
      switch (node.op) {
        case 'switch': {
          const pred = getParamValue('pred', node, tensorMap) as dl.Tensor;
          const data = getParamValue('data', node, tensorMap) as dl.Tensor;
          return pred.dataSync()[0] ? [undefined, data] : [data, undefined];
        }
        case 'merge':
          const inputName = node.inputNames.find(
              name => getTensor(name, tensorMap) !== undefined);
          return inputName ? [getTensor(name, tensorMap)] : undefined;
        default:
          throw TypeError(`Node type ${node.op} is not implemented`);
      }
    };

export const CATEGORY = 'arithmetic';
