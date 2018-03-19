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

import * as tf from '@tensorflow/tfjs-core';

import {NamedTensorsMap} from '../../data/index';
import {Node} from '../index';

import {OpExecutor} from './types';
import {getParamValue} from './utils';

export let executeOp: OpExecutor = (node: Node, tensorMap: NamedTensorsMap):
                                       tf.Tensor[] => {
  switch (node.op) {
    case 'equal': {
      return [tf.equal(
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    case 'greater': {
      return [tf.greater(
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    case 'greaterEqual': {
      return [tf.greaterEqual(
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    case 'less': {
      return [tf.less(
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    case 'lessEqual': {
      return [tf.lessEqual(
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    case 'logicalAnd': {
      return [tf.logicalAnd(
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    case 'logicalNot': {
      return [tf.logicalNot(getParamValue('a', node, tensorMap) as tf.Tensor)];
    }
    case 'logicalOr': {
      return [tf.logicalOr(
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    case 'where': {
      return [tf.where(
          getParamValue('condition', node, tensorMap) as tf.Tensor,
          getParamValue('a', node, tensorMap) as tf.Tensor,
          getParamValue('b', node, tensorMap) as tf.Tensor)];
    }
    default:
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
};

export const CATEGORY = 'logical';
