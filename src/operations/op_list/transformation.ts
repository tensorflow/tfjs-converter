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
    'tfOpName': 'Cast',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'SrcT'},
        'name': 'sdtype',
        'type': 'dtype',
        'notSupported': true
      },
      {attrMapper: {'tfName': 'DstT'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'ExpandDims',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'axis', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'Pad',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'padding', 'type': 'number[]'}, {
        attrMapper: {'tfName': 'constant_value'},
        'name': 'constantValue',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'PadV2',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'padding', 'type': 'number[]'}, {
        inputMapper: {'start': 2},
        'name': 'constantValue',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'Reshape',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'shape', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'Squeeze',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'axis', 'tfDeprecatedName': 'squeeze_dims'},
        'name': 'axis',
        'type': 'number[]'
      }
    ]
  },
  {
    'tfOpName': 'SpaceToBatchND',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'blockShape', 'type': 'number[]'},
      {inputMapper: {'start': 2}, 'name': 'paddings', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'BatchToSpaceND',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'blockShape', 'type': 'number[]'},
      {inputMapper: {'start': 2}, 'name': 'crops', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'DepthToSpace',
    'category': 'transformation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'block_size'},
        'name': 'blockSize',
        'type': 'number'
      },
      {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string'
      }
    ]
  }
];
