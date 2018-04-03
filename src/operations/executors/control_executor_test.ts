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
import * as tfc from '@tensorflow/tfjs-core';

import {GraphExecutor} from '../../executor';
import {Node} from '../index';

import {executeOp} from './control_executor';
import {createTensorAttr} from './test_helper';

describe('control', () => {
  let node: Node;
  const input1 = [tfc.scalar(1)];
  const executor = new GraphExecutor(
      {nodes: {}, inputs: [], outputs: [], withControlFlow: false});

  beforeEach(() => {
    node = {
      name: 'test',
      op: '',
      category: 'control',
      inputNames: ['pred', 'input1'],
      inputs: [],
      params: {x: createTensorAttr(0)},
      children: []
    };
  });

  describe('executeOp', () => {
    describe('switch', () => {
      it('should set the output condition is true', () => {
        node.op = 'switch';
        node.params['pred'] = createTensorAttr(0);
        node.params['data'] = createTensorAttr(1);

        const pred = [tfc.scalar(true)];
        expect(executeOp(node, {pred, input1}, executor)).toEqual([
          undefined, input1[0]
        ]);
      });
      it('should set the output condition is false', () => {
        node.op = 'switch';
        node.params['pred'] = createTensorAttr(0);
        node.params['data'] = createTensorAttr(1);

        const pred = [tfc.scalar(false)];
        expect(executeOp(node, {pred, input1}, executor)).toEqual([
          input1[0], undefined
        ]);
      });
    });
    describe('merge', () => {
      it('should return the first available input', () => {
        node.op = 'merge';

        const pred = [tfc.scalar(true)];
        expect(executeOp(node, {pred: undefined, input1}, executor))
            .toEqual(input1);
        expect(executeOp(node, {pred, input1: undefined}, executor))
            .toEqual(pred);
      });
      it('should return undefined if no inputs are available', () => {
        node.op = 'merge';
        expect(executeOp(node, {pred: undefined, input1: undefined}, executor))
            .toEqual(undefined);
      });
    });

    describe('enter', () => {
      it('should call enterFrame on executor', () => {
        spyOn(executor, 'enterFrame');
        node.op = 'enter';
        node.params['tensor'] = createTensorAttr(0);
        node.inputNames = ['input1'];

        expect(executeOp(node, {input1}, executor)).toEqual(input1);
        expect(executor.enterFrame).toHaveBeenCalled();
      });
    });
    describe('exit', () => {
      it('should call existFrame on executor', () => {
        spyOn(executor, 'exitFrame');
        node.op = 'exit';
        node.params['tensor'] = createTensorAttr(0);
        node.inputNames = ['input1'];

        expect(executeOp(node, {input1}, executor)).toEqual(input1);
        expect(executor.exitFrame).toHaveBeenCalled();
      });
    });
    describe('nextIteration', () => {
      it('should call nextIteration on executor', () => {
        spyOn(executor, 'nextIteration');
        node.op = 'nextIteration';
        node.params['tensor'] = createTensorAttr(0);
        node.inputNames = ['input1'];

        expect(executeOp(node, {input1}, executor)).toEqual(input1);
        expect(executor.nextIteration).toHaveBeenCalled();
      });
    });
  });
});
