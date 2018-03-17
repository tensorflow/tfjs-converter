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
import {getParamValue} from './utils';

export let executeOp: OpExecutor = (node: Node, tensorMap: NamedTensorsMap):
                                       dl.Tensor[] => {
  switch (node.op) {
    case 'equal': {
      return [dl.equal(
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    case 'greater': {
      return [dl.greater(
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    case 'greaterEqual': {
      return [dl.greaterEqual(
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    case 'less': {
      return [dl.less(
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    case 'lessEqual': {
      return [dl.lessEqual(
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    case 'logicalAnd': {
      return [dl.logicalAnd(
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    case 'logicalNot': {
      return [dl.logicalNot(getParamValue('a', node, tensorMap) as dl.Tensor)];
    }
    case 'logicalOr': {
      return [dl.logicalOr(
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    case 'where': {
      return [dl.where(
          getParamValue('condition', node, tensorMap) as dl.Tensor,
          getParamValue('a', node, tensorMap) as dl.Tensor,
          getParamValue('b', node, tensorMap) as dl.Tensor)];
    }
    default:
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
};

export const CATEGORY = 'logical';
