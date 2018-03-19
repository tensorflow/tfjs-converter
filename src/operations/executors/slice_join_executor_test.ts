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

import {executeOp} from './slice_join_executor';
// tslint:disable-next-line:max-line-length
import {createNumberAttr, createNumberAttrFromIndex, createNumericArrayAttr, createTensorAttr, createTensorsAttr} from './test_helper';

describe('slice join', () => {
  let node: Node;
  const input1 = [tf.scalar(1)];
  const input2 = [tf.scalar(2)];
  const input3 = [tf.scalar(3)];
  describe('multi-tensor ops', () => {
    beforeEach(() => {
      node = {
        name: 'test',
        op: '',
        category: 'slice_join',
        inputNames: ['input1', 'input2', 'input3'],
        inputs: [],
        params: {
          tensors: createTensorsAttr(0, 1),
          axis: createNumberAttrFromIndex(-1)
        },
        children: []
      };
    });
    describe('executeOp', () => {
      ['concat', 'stack'].forEach(op => {
        it('should call tf.' + op, () => {
          const spy = spyOn(tf, op as 'concat');
          node.op = op;
          executeOp(node, {input1, input2, input3});

          expect(spy).toHaveBeenCalledWith([input1[0], input2[0]], 3);
        });
      });
    });
  });
  describe('single-tensor ops', () => {
    beforeEach(() => {
      node = {
        name: 'test',
        op: '',
        category: 'slice_join',
        inputNames: ['input1'],
        inputs: [],
        params: {x: createTensorAttr(0)},
        children: []
      };
    });
    describe('executeOp', () => {
      it('should call tf.reverse', () => {
        spyOn(tf, 'reverse');
        node.op = 'reverse';
        node.params.axis = createNumberAttrFromIndex(1);
        node.inputNames = ['input1', 'input2'];
        executeOp(node, {input1, input2});

        expect(tf.reverse).toHaveBeenCalledWith(input1[0], 2);
      });

      it('should call tf.tile', () => {
        spyOn(tf, 'tile');
        node.op = 'tile';
        node.params.reps = createNumberAttrFromIndex(1);
        node.inputNames = ['input1', 'input2'];
        executeOp(node, {input1, input2});

        expect(tf.tile).toHaveBeenCalledWith(input1[0], 2);
      });

      it('should call tf.slice', () => {
        spyOn(tf, 'slice');
        node.op = 'slice';
        node.params.begin = createNumericArrayAttr([1]);
        node.params.size = createNumericArrayAttr([2]);
        executeOp(node, {input1});

        expect(tf.slice).toHaveBeenCalledWith(input1[0], [1], [2]);
      });

      it('should call tf.gather', () => {
        spyOn(tf, 'gather');
        node.op = 'gather';
        node.params.axis = createNumberAttr(1);
        node.params.indices = createTensorAttr(1);
        node.inputNames = ['input1', 'input2'];
        executeOp(node, {input1, input2});

        expect(tf.gather).toHaveBeenCalledWith(input1[0], input2[0], 1);
      });
    });
  });
});
