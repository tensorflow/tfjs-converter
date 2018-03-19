/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {Node} from '../index';

import {executeOp} from './reduction_executor';
// tslint:disable-next-line:max-line-length
import {createBoolAttr, createNumberAttr, createTensorAttr} from './test_helper';

describe('reduction', () => {
  let node: Node;
  const input1 = [tf.scalar(1)];

  beforeEach(() => {
    node = {
      name: 'test',
      op: '',
      category: 'logical',
      inputNames: ['input1'],
      inputs: [],
      params: {
        x: createTensorAttr(0),
        axis: createNumberAttr(1),
        keepDims: createBoolAttr(true)
      },
      children: []
    };
  });

  describe('executeOp', () => {
    ['max', 'mean', 'min', 'sum'].forEach(op => {
      it('should call tf.' + op, () => {
        const spy = spyOn(tf, op as 'max');
        node.op = op;
        executeOp(node, {input1});

        expect(spy).toHaveBeenCalledWith(input1[0], 1, true);
      });
    });
    describe('argMax', () => {
      it('should call tf.argMax', () => {
        spyOn(tf, 'argMax');
        node.op = 'argMax';
        executeOp(node, {input1});

        expect(tf.argMax).toHaveBeenCalledWith(input1[0], 1);
      });
    });
    describe('argMin', () => {
      it('should call tf.argMin', () => {
        spyOn(tf, 'argMin');
        node.op = 'argMin';
        executeOp(node, {input1});

        expect(tf.argMin).toHaveBeenCalledWith(input1[0], 1);
      });
    });
  });
});
