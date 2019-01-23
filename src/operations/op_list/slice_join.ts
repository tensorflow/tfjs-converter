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
    'tfOpName': 'ConcatV2',
    'category': 'slice_join',
    'params': [
      {
        inputMapper: {'start': 0, 'end': -1},
        'name': 'tensors',
        'type': 'tensors'
      },
      {inputMapper: {'start': -1}, 'name': 'axis', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'Concat',
    'category': 'slice_join',
    'params': [
      {
        inputMapper: {'start': 1, 'end': 0},
        'name': 'tensors',
        'type': 'tensors'
      },
      {inputMapper: {'start': 0}, 'name': 'axis', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'GatherV2',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'indices', 'type': 'tensor'}, {
        inputMapper: {'start': 2},
        'name': 'axis',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'Gather',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'indices', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'axis'},
        'name': 'axis',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'validate_indices'},
        'name': 'validateIndices',
        'type': 'bool',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Reverse',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'}, {
        inputMapper: {'start': 1},
        'name': 'dims',
        'type': 'bool',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'ReverseV2',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'axis', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'Slice',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'begin', 'type': 'number[]'},
      {inputMapper: {'start': 2}, 'name': 'size', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'StridedSlice',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'begin', 'type': 'number[]'},
      {inputMapper: {'start': 2}, 'name': 'end', 'type': 'number[]'},
      {inputMapper: {'start': 3}, 'name': 'strides', 'type': 'number[]'}, {
        attrMapper: {'tfName': 'begin_mask'},
        'name': 'beginMask',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'end_mask'},
        'name': 'endMask',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'new_axis_mask'},
        'name': 'newAxisMask',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'ellipsis_mask'},
        'name': 'ellipsisMask',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'shrink_axis_mask'},
        'name': 'shrinkAxisMask',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'Pack',
    'category': 'slice_join',
    'params': [
      {
        inputMapper: {'start': 0, 'end': 0},
        'name': 'tensors',
        'type': 'tensors'
      },
      {
        attrMapper: {'tfName': 'axis'},
        'name': 'axis',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'Unpack',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'tensor', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'axis'},
        'name': 'axis',
        'type': 'number',
        'defaultValue': 0
      },
      {
        attrMapper: {'tfName': 'num'},
        'name': 'num',
        'type': 'number',
        'defaultValue': 0,
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Tile',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'reps', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'Split',
    'category': 'slice_join',
    'params': [
      {
        inputMapper: {'start': 0},
        'name': 'axis',
        'type': 'number',
        'defaultValue': 0
      },
      {inputMapper: {'start': 1}, 'name': 'x', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'num_split'},
        'name': 'numOrSizeSplits',
        'type': 'number',
        'defaultValue': 1
      }
    ]
  },
  {
    'tfOpName': 'SplitV',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'}, {
        inputMapper: {'start': 1},
        'name': 'numOrSizeSplits',
        'type': 'number[]'
      },
      {
        inputMapper: {'start': 2},
        'name': 'axis',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'ScatterNd',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'indices', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'values', 'type': 'tensor'},
      {inputMapper: {'start': 2}, 'name': 'shape', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'GatherNd',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'indices', 'type': 'tensor'}
    ]
  },
  {
    'tfOpName': 'SparseToDense',
    'category': 'slice_join',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'sparseIndices', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'outputShape', 'type': 'number[]'},
      {inputMapper: {'start': 2}, 'name': 'sparseValues', 'type': 'tensor'},
      {inputMapper: {'start': 3}, 'name': 'defaultValue', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'validate_indices'},
        'name': 'validateIndices',
        'type': 'bool',
        'defaultValue': false,
        'notSupported': true
      }
    ]
  }
];
