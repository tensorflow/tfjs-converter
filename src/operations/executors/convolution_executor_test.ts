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

import {executeOp} from './convolution_executor';
// tslint:disable-next-line:max-line-length
import {createNumberAttr, createNumericArrayAttr, createStrAttr, createTensorAttr} from './test_helper';

describe('convolution', () => {
  let node: Node;
  const input = [tf.scalar(1)];

  beforeEach(() => {
    node = {
      name: 'test',
      op: '',
      category: 'convolution',
      inputNames: ['input'],
      inputs: [],
      params: {x: createTensorAttr(0)},
      children: []
    };
  });

  describe('executeOp', () => {
    describe('avgPool', () => {
      it('should call tf.avgPool', () => {
        spyOn(tf, 'avgPool');
        node.op = 'avgPool';
        node.params['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.params['pad'] = createStrAttr('same');
        node.params['kernelSize'] = createNumericArrayAttr([1, 2, 2, 1]);

        executeOp(node, {input});

        expect(tf.avgPool)
            .toHaveBeenCalledWith(input[0], [2, 2], [2, 2], 'same');
      });
    });

    describe('maxPool', () => {
      it('should call tf.maxPool', () => {
        spyOn(tf, 'maxPool');
        node.op = 'maxPool';
        node.params['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.params['pad'] = createStrAttr('same');
        node.params['kernelSize'] = createNumericArrayAttr([1, 2, 2, 1]);

        executeOp(node, {input});

        expect(tf.maxPool)
            .toHaveBeenCalledWith(input[0], [2, 2], [2, 2], 'same');
      });
    });
    describe('Conv2d', () => {
      it('should call tf.conv2d', () => {
        spyOn(tf, 'conv2d');
        node.op = 'conv2d';
        node.params['filter'] = createTensorAttr(1);
        node.params['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.params['pad'] = createStrAttr('same');

        const input1 = [tf.scalar(1.0)];
        const input2 = [tf.scalar(1.0)];
        node.inputNames = ['input1', 'input2'];

        executeOp(node, {input1, input2});

        expect(tf.conv2d).toHaveBeenCalledWith(
            input1[0], input2[0], [2, 2], 'same');
      });
    });
    describe('conv2dTranspose', () => {
      it('should call tf.conv2dTranspose', () => {
        spyOn(tf, 'conv2dTranspose');
        node.op = 'conv2dTranspose';
        node.params['outputShape'] = createNumericArrayAttr([1, 2, 2, 2]);
        node.params['filter'] = createTensorAttr(1);
        node.params['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.params['pad'] = createStrAttr('same');

        const input1 = [tf.scalar(1.0)];
        const input2 = [tf.scalar(1.0)];
        node.inputNames = ['input1', 'input2'];

        executeOp(node, {input1, input2});

        expect(tf.conv2dTranspose)
            .toHaveBeenCalledWith(
                input1[0], input2[0], [1, 2, 2, 2], [2, 2], 'same');
      });
    });
    describe('Conv1d', () => {
      it('should call tf.conv1d', () => {
        spyOn(tf, 'conv1d');
        node.op = 'conv1d';
        node.category = 'convolution';
        node.params['filter'] = createTensorAttr(1);
        node.params['stride'] = createNumberAttr(1);
        node.params['pad'] = createStrAttr('same');

        const input1 = [tf.scalar(1.0)];
        const input2 = [tf.scalar(1.0)];
        node.inputNames = ['input1', 'input2'];

        executeOp(node, {input1, input2});

        expect(tf.conv1d).toHaveBeenCalledWith(input1[0], input2[0], 1, 'same');
      });
    });

    describe('depthwiseConv2d', () => {
      it('should call tf.depthwiseConv2d', () => {
        spyOn(tf, 'depthwiseConv2d');
        node.op = 'depthwiseConv2d';
        node.category = 'convolution';
        node.params['input'] = createTensorAttr(0);
        node.params['filter'] = createTensorAttr(1);
        node.params['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.params['pad'] = createStrAttr('same');
        node.params['rates'] = createNumericArrayAttr([2, 2]);
        const input1 = [tf.scalar(1.0)];
        const input2 = [tf.scalar(1.0)];
        node.inputNames = ['input1', 'input2'];

        executeOp(node, {input1, input2});

        expect(tf.depthwiseConv2d)
            .toHaveBeenCalledWith(input1[0], input2[0], [2, 2], 'same', [2, 2]);
      });
    });
  });
});
