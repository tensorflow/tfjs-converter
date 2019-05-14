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

import {scalar} from '@tensorflow/tfjs-core';

import {getCustomOp, registerCustomOp} from './register';
import {deregisterCustomOp} from './register';

describe('register custom op', () => {
  describe('registerCustomOp', () => {
    it('should auto fill missing fields', () => {
      const executor = () => scalar(1);
      registerCustomOp('newOp', executor);
      const opMapper = getCustomOp('newOp');
      expect(opMapper.tfOpName).toEqual('newOp');
      expect(opMapper.category).toEqual('custom');
      expect(opMapper.inputs).toEqual([]);
      expect(opMapper.attrs).toEqual([]);
      expect(opMapper.customExecutor).toEqual(executor);
      deregisterCustomOp('newOp');
    });
  });
  describe('deRegisterCustomOp', () => {
    it('should remove the custom op', () => {
      registerCustomOp('newOp', () => scalar(1));
      expect(getCustomOp('newOp')).toBeDefined();
      deregisterCustomOp('newOp');
      expect(getCustomOp('newOp')).not.toBeDefined();
    });
  });
});
