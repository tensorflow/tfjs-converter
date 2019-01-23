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
    'tfOpName': 'LoopCond',
    'category': 'control',
    'params': [{inputMapper: {'start': 0}, 'name': 'pred', 'type': 'tensor'}]
  },
  {
    'tfOpName': 'Switch',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'data', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'pred', 'type': 'tensor'}
    ]
  },
  {
    'tfOpName': 'Merge',
    'category': 'control',
    'params': [{
      inputMapper: {'start': 0, 'end': 0},
      'name': 'tensors',
      'type': 'tensors'
    }]
  },
  {
    'tfOpName': 'Enter',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensor', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      },
      {
        attrMapper: {'tfName': 'frame_name'},
        'name': 'frameName',
        'type': 'string'
      },
      {
        attrMapper: {'tfName': 'is_constant'},
        'name': 'isConstant',
        'type': 'bool'
      }
    ]
  },
  {
    'tfOpName': 'Exit',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensor', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'NextIteration',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensor', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'TensorArrayV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'size', 'type': 'number'},
      {attrMapper: {'tfName': 'dtype'}, 'name': 'dtype', 'type': 'dtype'}, {
        attrMapper: {'tfName': 'element_shape'},
        'name': 'elementShape',
        'type': 'shape'
      },
      {
        attrMapper: {'tfName': 'dynamic_size'},
        'name': 'dynamicSize',
        'type': 'bool'
      },
      {
        attrMapper: {'tfName': 'clear_after_read'},
        'name': 'clearAfterRead',
        'type': 'bool'
      },
      {
        attrMapper: {'tfName': 'identical_element_shapes'},
        'name': 'identicalElementShapes',
        'type': 'bool'
      },
      {
        attrMapper: {'tfName': 'tensor_array_name'},
        'name': 'name',
        'type': 'string'
      }
    ]
  },
  {
    'tfOpName': 'TensorArrayWriteV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'index', 'type': 'number'},
      {inputMapper: {'start': 2}, 'name': 'tensor', 'type': 'tensor'},
      {inputMapper: {'start': 3}, 'name': 'flowIn', 'type': 'number'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'TensorArrayReadV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'index', 'type': 'number'},
      {inputMapper: {'start': 2}, 'name': 'flowIn', 'type': 'number'}, {
        attrMapper: {'tfName': 'dtype'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'TensorArrayGatherV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'indices', 'type': 'number[]'},
      {inputMapper: {'start': 2}, 'name': 'flowIn', 'type': 'number'},
      {attrMapper: {'tfName': 'dtype'}, 'name': 'dtype', 'type': 'dtype'}, {
        attrMapper: {'tfName': 'element_shape'},
        'name': 'elementShape',
        'type': 'shape'
      }
    ]
  },
  {
    'tfOpName': 'TensorArrayScatterV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'indices', 'type': 'number[]'},
      {inputMapper: {'start': 2}, 'name': 'tensor', 'type': 'tensor'},
      {inputMapper: {'start': 3}, 'name': 'flowIn', 'type': 'number'},
      {attrMapper: {'tfName': 'T'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'TensorArrayConcatV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'flowIn', 'type': 'number'},
      {attrMapper: {'tfName': 'dtype'}, 'name': 'dtype', 'type': 'dtype'}, {
        attrMapper: {'tfName': 'element_shape_except0'},
        'name': 'elementShapeExcept0',
        'type': 'shape',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'TensorArraySplitV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'tensor', 'type': 'tensor'},
      {inputMapper: {'start': 2}, 'name': 'lengths', 'type': 'number[]'},
      {inputMapper: {'start': 3}, 'name': 'flowIn', 'type': 'number'},
      {attrMapper: {'tfName': 'T'}, 'name': 'dtype', 'type': 'dtype'}
    ]
  },
  {
    'tfOpName': 'TensorArraySizeV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'},
      {inputMapper: {'start': 1}, 'name': 'flowIn', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'TensorArrayCloseV3',
    'category': 'control',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensorArrayId', 'type': 'number'}
    ]
  }
];
