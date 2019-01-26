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
    'tfOpName': 'Add',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'AddN',
    'category': 'arithmetic',
    'inputParams':
        [{'start': 0, 'end': 0, 'name': 'tensors', 'type': 'tensors'}]
  },
  {
    'tfOpName': 'BiasAdd',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'Sub',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'RealDiv',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'Div',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'FloorDiv',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'Mul',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'Maximum',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'}
    ]
  },
  {
    'tfOpName': 'Minimum',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'}
    ]
  },
  {
    'tfOpName': 'Pow',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'SquaredDifference',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'Mod',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [
      {'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true}
    ]
  },
  {
    'tfOpName': 'FloorMod',
    'category': 'arithmetic',
    'inputParams': [
      {'start': 0, 'name': 'a', 'type': 'tensor'},
      {'start': 1, 'name': 'b', 'type': 'tensor'},
    ],
    'attrParams': [{
      'tfName': 'T',
      'name': 'dtype',
      'type': 'dtype',
      'notSupported': true
    }]
  }
];
