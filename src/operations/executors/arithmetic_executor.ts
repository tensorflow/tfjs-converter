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

export let executeOp: OpExecutor =
    (node: Node, tensorMap: NamedTensorsMap): tf.Tensor[] => {
      switch (node.op) {
        case 'add': {
          return [tf.add(
              getParamValue('a', node, tensorMap) as tf.Tensor,
              getParamValue('b', node, tensorMap) as tf.Tensor)];
        }
        case 'mul':
          return [tf.mul(
              getParamValue('a', node, tensorMap) as tf.Tensor,
              getParamValue('b', node, tensorMap) as tf.Tensor)];
        case 'div': {
          return [tf.div(
              getParamValue('a', node, tensorMap) as tf.Tensor,
              getParamValue('b', node, tensorMap) as tf.Tensor)];
        }
        case 'sub': {
          return [tf.sub(
              getParamValue('a', node, tensorMap) as tf.Tensor,
              getParamValue('b', node, tensorMap) as tf.Tensor)];
        }
        case 'minimum': {
          return [tf.minimum(
              getParamValue('a', node, tensorMap) as tf.Tensor,
              getParamValue('b', node, tensorMap) as tf.Tensor)];
        }
        case 'maximum': {
          return [tf.maximum(
              getParamValue('a', node, tensorMap) as tf.Tensor,
              getParamValue('b', node, tensorMap) as tf.Tensor)];
        }
        case 'pow': {
          return [tf.pow(
              getParamValue('a', node, tensorMap) as tf.Tensor,
              getParamValue('b', node, tensorMap) as tf.Tensor)];
        }
        default:
          throw TypeError(`Node type ${node.op} is not implemented`);
      }
    };

export const CATEGORY = 'arithmetic';
