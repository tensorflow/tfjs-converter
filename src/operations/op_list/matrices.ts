import {OpMapper} from '../types';

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

export const json: OpMapper[] = [
  {
    'tfOpName': 'MatMul',
    'category': 'matrices',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'a', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'b', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'transpose_a'},
        'name': 'transposeA',
        'type': 'bool',
        'defaultValue': false
      },
      {
        attrMapper: {'tfName': 'transpose_b'},
        'name': 'transposeB',
        'type': 'bool',
        'defaultValue': false
      },
      {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'BatchMatMul',
    'category': 'matrices',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'a', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'b', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'adj_x'},
        'name': 'transposeA',
        'type': 'bool',
        'defaultValue': false
      },
      {
        attrMapper: {'tfName': 'adj_y'},
        'name': 'transposeB',
        'type': 'bool',
        'defaultValue': false
      },
      {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Transpose',
    'category': 'matrices',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'perm', 'type': 'number[]'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  }
];
