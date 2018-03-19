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

import {executeOp} from './normalization_executor';
import {createNumberAttr, createTensorAttr} from './test_helper';

describe('normalization', () => {
  let node: Node;
  const input1 = [tf.scalar(1)];

  beforeEach(() => {
    node = {
      name: 'test',
      op: '',
      category: 'normalization',
      inputNames: ['input1'],
      inputs: [],
      params: {x: createTensorAttr(0)},
      children: []
    };
  });

  describe('executeOp', () => {
    describe('batchNormalization', () => {
      it('should call tf.batchNormalization', () => {
        spyOn(tf, 'batchNormalization');
        node.op = 'batchNormalization';
        node.params.scale = createTensorAttr(1);
        node.params.offset = createTensorAttr(2);
        node.params.mean = createTensorAttr(3);
        node.params.variance = createTensorAttr(4);
        node.params.epislon = createNumberAttr(5);
        node.inputNames = ['input1', 'input2', 'input3', 'input4', 'input5'];
        const input2 = [tf.scalar(1)];
        const input3 = [tf.scalar(2)];
        const input4 = [tf.scalar(3)];
        const input5 = [tf.scalar(4)];
        executeOp(node, {input1, input2, input3, input4, input5});

        expect(tf.batchNormalization)
            .toHaveBeenCalledWith(
                input1[0], input4[0], input5[0], 5, input2[0], input3[0]);
      });
    });

    describe('localResponseNormalization', () => {
      it('should call tf.localResponseNormalization', () => {
        spyOn(tf, 'localResponseNormalization');
        node.op = 'localResponseNormalization';
        node.params.radius = createNumberAttr(1);
        node.params.bias = createNumberAttr(2);
        node.params.alpha = createNumberAttr(3);
        node.params.beta = createNumberAttr(4);

        executeOp(node, {input1});

        expect(tf.localResponseNormalization)
            .toHaveBeenCalledWith(input1[0], 1, 2, 3, 4);
      });
    });

    describe('softmax', () => {
      it('should call tf.softmax', () => {
        spyOn(tf, 'softmax');
        node.op = 'softmax';

        executeOp(node, {input1});

        expect(tf.softmax).toHaveBeenCalledWith(input1[0]);
      });
    });
  });
});
