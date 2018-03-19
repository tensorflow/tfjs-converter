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
    case 'concat': {
      const axis = getParamValue('axis', node, tensorMap) as number;
      const inputs = getParamValue('tensors', node, tensorMap) as tf.Tensor[];
      return [tf.concat(inputs, axis)];
    }
    case 'gather': {
      const axis = getParamValue('axis', node, tensorMap) as number;
      const input = getParamValue('x', node, tensorMap) as tf.Tensor;
      const indices = getParamValue('indices', node, tensorMap) as tf.Tensor1D;
      return [tf.gather(input, indices, axis)];
    }
    case 'reverse': {
      const axis = getParamValue('axis', node, tensorMap) as number;
      const input = getParamValue('x', node, tensorMap) as tf.Tensor;
      return [tf.reverse(input, axis)];
    }
    case 'slice': {
      // tslint:disable-next-line:no-any
      const begin = getParamValue('begin', node, tensorMap) as any;
      // tslint:disable-next-line:no-any
      const size = getParamValue('size', node, tensorMap) as any;
      return [tf.slice(
          getParamValue('x', node, tensorMap) as tf.Tensor, begin, size)];
    }
    case 'stack': {
      const axis = getParamValue('axis', node, tensorMap) as number;
      return [tf.stack(
          getParamValue('tensors', node, tensorMap) as tf.Tensor[], axis)];
    }
    case 'tile': {
      const reps = getParamValue('reps', node, tensorMap) as number[];
      return [tf.tile(getParamValue('x', node, tensorMap) as tf.Tensor, reps)];
    }
    default:
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
};

export const CATEGORY = 'slice_join';
