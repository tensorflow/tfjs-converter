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
import {getParamValue, getTensor} from './utils';

export let executeOp: OpExecutor =
    (node: Node, tensorMap: NamedTensorsMap): tf.Tensor[] => {
      switch (node.op) {
        case 'abs':
          return [tf.abs(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'acos':
          return [tf.acos(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'asin':
          return [tf.asin(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'atan':
          return [tf.atan(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'ceil':
          return [tf.ceil(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'cos':
          return [tf.cos(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'cosh':
          return [tf.cosh(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'elu':
          return [tf.elu(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'exp':
          return [tf.exp(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'floor':
          return [tf.floor(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'log':
          return [tf.log(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'relu':
          return [tf.relu(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'selu':
          return [tf.selu(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'sigmoid':
          return [tf.sigmoid(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'sin':
          return [tf.sin(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'sinh': {
          return [tf.sinh(getParamValue('x', node, tensorMap) as tf.Tensor)];
        }
        case 'sqrt': {
          return [tf.sqrt(getParamValue('x', node, tensorMap) as tf.Tensor)];
        }
        case 'square': {
          return [tf.square(getParamValue('x', node, tensorMap) as tf.Tensor)];
        }
        case 'tanh': {
          return [tf.tanh(getParamValue('x', node, tensorMap) as tf.Tensor)];
        }
        case 'tan':
          return [tf.tan(getParamValue('x', node, tensorMap) as tf.Tensor)];
        case 'clipByValue':
          return [tf.clipByValue(
              getParamValue('x', node, tensorMap) as tf.Tensor,
              getParamValue('clipValueMin', node, tensorMap) as number,
              getParamValue('clipValueMax', node, tensorMap) as number)];
        case 'rsqrt':
          return [tf.div(
              tf.scalar(1.0, 'float32'),
              tf.sqrt(getTensor(node.inputNames[0], tensorMap)))];

        default:
          throw TypeError(`Node type ${node.op} is not implemented`);
      }
    };

export const CATEGORY = 'basic_math';
