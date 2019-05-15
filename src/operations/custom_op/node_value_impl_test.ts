/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import {scalar, test_util} from '@tensorflow/tfjs-core';

import * as tensorflow from '../../data/compiled_api';
import {ExecutionContext} from '../../executor/execution_context';
import {Node} from '../types';

import {NodeValueImpl} from './node_value_impl';

const NODE: Node = {
  name: 'test',
  op: 'const',
  category: 'custom',
  inputNames: ['a', 'b'],
  inputs: [],
  inputParams: {},
  attrParams: {},
  children: [],
  rawAttrs: {
    c: {tensor: {}},
    d: {i: 3},
    e: {s: 'TkhXQw=='},
    f: {type: tensorflow.DataType.DT_FLOAT},
    g: {b: true},
    h: {f: 4.5},
    i: {list: {i: [3]}},
    j: {list: {f: [4.5]}},
    k: {list: {s: ['TkhXQw==']}},
    l: {list: {type: [tensorflow.DataType.DT_FLOAT]}},
    m: {shape: {dim: [{name: 'a', size: 1}]}},
    n: {list: {shape: [{dim: [{name: 'a', size: 1}]}]}},
    o: {list: {b: [true]}}
  }
};
const TENSOR_MAP = {
  'a': [scalar(1)],
  'b': [scalar(2)],
  'test': [scalar(3)]
};

let nodeValue: NodeValueImpl;
describe('NodeValueImpl', () => {
  beforeEach(() => {
    nodeValue =
        new NodeValueImpl(NODE, TENSOR_MAP, new ExecutionContext({}, {}));
  });
  describe('getInput', () => {
    it('should find tensor from tensormap', async () => {
      const result = nodeValue.getInput(0);
      test_util.expectArraysClose(await result.data(), [1]);

      const result2 = nodeValue.getInput(1);
      test_util.expectArraysClose(await result2.data(), [2]);
    });
  });
  describe('getAttr', () => {
    it('should parse number', () => {
      expect(nodeValue.getAttr('d')).toEqual(3);
      expect(nodeValue.getAttr('h')).toEqual(4.5);
    });
    it('should parse number[]', () => {
      expect(nodeValue.getAttr('i')).toEqual([3]);
      expect(nodeValue.getAttr('j')).toEqual([4.5]);
    });
    it('should parse string', () => {
      expect(nodeValue.getAttr('e')).toEqual('nhwc');
    });
    it('should parse string[]', () => {
      expect(nodeValue.getAttr('k')).toEqual(['nhwc']);
    });
    it('should parse boolean', () => {
      expect(nodeValue.getAttr('g')).toEqual(true);
    });
    it('should parse boolean[]', () => {
      expect(nodeValue.getAttr('o')).toEqual([true]);
    });
    it('should parse dtype', () => {
      expect(nodeValue.getAttr('f')).toEqual('float32');
    });
    it('should parse dtype[]', () => {
      expect(nodeValue.getAttr('l')).toEqual(['float32']);
    });
    it('should parse tensor shape', () => {
      expect(nodeValue.getAttr('m')).toEqual([1]);
    });
    it('should parse tensor shape[]', () => {
      expect(nodeValue.getAttr('n')).toEqual([[1]]);
    });
  });
});
