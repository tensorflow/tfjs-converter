/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import {OpMapper, ParamValue} from '../types';
import {Node} from '../types';

export function createNumberAttr(value: number): ParamValue {
  return {value, type: 'number'};
}

export function createNumberAttrFromIndex(inputIndex: number): ParamValue {
  return {inputIndex, type: 'number'};
}

export function createStrAttr(str: string): ParamValue {
  return {value: str, type: 'string'};
}

export function createBoolAttr(value: boolean): ParamValue {
  return {value, type: 'bool'};
}

export function createTensorShapeAttr(value: number[]): ParamValue {
  return {value, type: 'shape'};
}
export function createNumericArrayAttr(value: number[]): ParamValue {
  return {value, type: 'number[]'};
}

export function createNumericArrayAttrFromIndex(inputIndex: number):
    ParamValue {
  return {inputIndex, type: 'number[]'};
}

export function createTensorAttr(index: number): ParamValue {
  return {inputIndex: index, type: 'tensor'};
}

export function createTensorsAttr(
    index: number, paramLength: number): ParamValue {
  return {inputIndex: index, inputParamLength: paramLength, type: 'tensors'};
}

export function createDtypeAttr(dtype: string): ParamValue {
  return {value: dtype, type: 'dtype'};
}

export function validateParam(
    node: Node, opMappers: OpMapper[], tfOpName?: string) {
  const opMapper = tfOpName != null ?
      opMappers.find(mapper => mapper.tfOpName === tfOpName) :
      opMappers.find(mapper => mapper.dlOpName === node.op);
  return Object.keys(node.params).every(key => {
    const value = node.params[key];
    const def = opMapper.params.find(param => param.dlParamName === key);
    return def && def.type === value.type &&
        def.tfInputIndex === value.inputIndex;
  });
}
