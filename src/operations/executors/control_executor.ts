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

import * as tfc from '@tensorflow/tfjs-core';

import {NamedTensorsMap} from '../../data/index';
import {GraphExecutor} from '../../executor';
import {Node} from '../index';

import {OpExecutor} from './types';
import {getParamValue, getTensor} from './utils';

export let executeOp: OpExecutor = (node: Node, tensorMap: NamedTensorsMap,
                                    executor: GraphExecutor): tfc.Tensor[] => {
  switch (node.op) {
    case 'loopCond':
      return [getParamValue('pred', node, tensorMap, executor) as tfc.Tensor];
    case 'switch': {
      const pred =
          getParamValue('pred', node, tensorMap, executor) as tfc.Tensor;
      const data =
          getParamValue('data', node, tensorMap, executor) as tfc.Tensor;
      // Outputs nodes :0 => false, :1 => true
      return pred.dataSync()[0] ? [undefined, data] : [data, undefined];
    }
    case 'merge':
      const inputName = node.inputNames.find(
          name => getTensor(name, tensorMap, executor) !== undefined);
      return inputName ? [getTensor(inputName, tensorMap, executor)] :
                         undefined;

    case 'enter':
      const data =
          getParamValue('tensor', node, tensorMap, executor) as tfc.Tensor;
      executor.enterFrame();
      return [data];

    case 'exit':
      const tensor =
          getParamValue('tensor', node, tensorMap, executor) as tfc.Tensor;
      executor.exitFrame();
      return [tensor];

    case 'nextIteration':
      const input =
          getParamValue('tensor', node, tensorMap, executor) as tfc.Tensor;
      executor.nextIteration();
      return [input];
    default:
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
};

export const CATEGORY = 'control';
