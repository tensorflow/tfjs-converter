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
    'tfOpName': 'Fill',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'shape', 'type': 'number[]'},
      {inputMapper: {'start': 1}, 'name': 'value', 'type': 'number'},
      {attrMapper: {'tfName': 'T'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'LinSpace',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'start', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'stop', 'type': 'number'},
      {inputMapper: {'start': 2}, 'name': 'num', 'type': 'number'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'OneHot',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'indices', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'depth', 'type': 'number'}, {
        inputMapper: {'start': 2},
        'name': 'onValue',
        'type': 'number',
        'defaultValue': 1
      },
      {
        inputMapper: {'start': 3},
        'name': 'offValue',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'axis'},
        'name': 'axis',
        'type': 'number',
        'notSupported': true
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
    'tfOpName': 'Ones',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'shape', 'type': 'number[]'},
      {attrMapper: {'tfName': 'T'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'OnesLike',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {attrMapper: {'tfName': 'dtype'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'RandomUniform',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'shape', 'type': 'number[]'}, {
        attrMapper: {'tfName': 'minval'},
        'name': 'minval',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'maxval'},
        'name': 'maxval',
        'type': 'number',
        'defaultValue': 1
      },
      {attrMapper: {'tfName': 'dtype'}, 'name': 'dtype', 'type': 'dtype'}, {
        attrMapper: {'tfName': 'seed'},
        'name': 'seed',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'seed2'},
        'name': 'seed2',
        'type': 'number',
        'defaultValue': 0,
        'notSupported': true
      },
      {
        attrMapper: {'tfName': 'T'},
        'name': 'T',
        'type': 'number',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Range',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'start', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'stop', 'type': 'number'}, {
        inputMapper: {'start': 2},
        'name': 'step',
        'type': 'number',
        'defaultValue': 0
      },
      {attrMapper: {'tfName': 'Tidx'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'TruncatedNormal',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'shape', 'type': 'number[]'}, {
        attrMapper: {'tfName': 'means'},
        'name': 'mean',
        'type': 'number',
        'defaultValue': 0.0
      },
      {
        attrMapper: {'tfName': 'stddev'},
        'name': 'stdDev',
        'type': 'number',
        'defaultValue': 1.0
      },
      {attrMapper: {'tfName': 'seed'}, 'name': 'seed', 'type': 'number'}, {
        attrMapper: {'tfName': 'seed2'},
        'name': 'seed2',
        'type': 'number',
        'defaultValue': 0,
        'notSupported': true
      },
      {attrMapper: {'tfName': 'dtype'}, 'name': 'dtype', 'type': 'dtype'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'T',
        'type': 'number',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Zeros',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'shape', 'type': 'number[]'},
      {attrMapper: {'tfName': 'T'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'ZerosLike',
    'category': 'creation',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {attrMapper: {'tfName': 'T'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  }
];
