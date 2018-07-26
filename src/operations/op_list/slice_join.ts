export const json = [
  {
    'tfOpName': 'ConcatV2',
    'dlOpName': 'concat',
    'category': 'slice_join',
    'params': [
      {
        'tfInputIndex': 0,
        'tfInputParamLength': 1,
        'dlParamName': 'tensors',
        'type': 'tensors'
      },
      {'tfInputIndex': -1, 'dlParamName': 'axis', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'Concat',
    'dlOpName': 'concat',
    'category': 'slice_join',
    'params': [
      {
        'tfInputIndex': 1,
        'tfInputParamLength': 1,
        'dlParamName': 'tensors',
        'type': 'tensors'
      },
      {'tfInputIndex': 0, 'dlParamName': 'axis', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'GatherV2',
    'dlOpName': 'gather',
    'category': 'slice_join',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'indices', 'type': 'tensor'}, {
        'tfParamName': 'axis',
        'dlParamName': 'axis',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'Gather',
    'dlOpName': 'gather',
    'category': 'slice_join',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'indices', 'type': 'tensor'}, {
        'tfParamName': 'axis',
        'dlParamName': 'axis',
        'type': 'number',
        'defaultValue': 0
      },
      {
        'tfParamName': 'validate_indices',
        'dlParamName': 'validateIndices',
        'type': 'bool',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Reverse',
    'dlOpName': 'reverse',
    'category': 'slice_join',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'ReverseV2',
    'dlOpName': 'reverse',
    'category': 'slice_join',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number'}
    ]
  },
  {
    'tfOpName': 'Slice',
    'dlOpName': 'slice',
    'category': 'slice_join',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'begin', 'type': 'number[]'},
      {'tfInputIndex': 2, 'dlParamName': 'size', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'StridedSlice',
    'dlOpName': 'stridedSlice',
    'category': 'slice_join',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'begin', 'type': 'number[]'},
      {'tfInputIndex': 2, 'dlParamName': 'end', 'type': 'number[]'},
      {'tfInputIndex': 3, 'dlParamName': 'strides', 'type': 'number[]'}, {
        'tfParamName': 'begin_mask',
        'dlParamName': 'beginMask',
        'type': 'number',
        'defaultValue': 0
      },
      {
        'tfParamName': 'end_mask',
        'dlParamName': 'endMask',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'Pack',
    'dlOpName': 'stack',
    'category': 'slice_join',
    'params': [
      {
        'tfInputIndex': 0,
        'tfInputParamLength': 0,
        'dlParamName': 'tensors',
        'type': 'tensors'
      },
      {
        'tfParamName': 'axis',
        'dlParamName': 'axis',
        'type': 'number',
        'defaultValue': 0
      }
    ]
  },
  {
    'tfOpName': 'Unpack',
    'dlOpName': 'unstack',
    'category': 'slice_join',
    'params': [
      {
        'tfInputIndex': 0,
        'tfInputParamLength': 0,
        'dlParamName': 'tensor',
        'type': 'tensor'
      },
      {
        'tfParamName': 'axis',
        'dlParamName': 'axis',
        'type': 'number',
        'defaultValue': 0
      },
      {
        'tfParamName': 'num',
        'dlParamName': 'num',
        'type': 'number',
        'defaultValue': 0,
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Tile',
    'dlOpName': 'tile',
    'category': 'slice_join',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'reps', 'type': 'number[]'}
    ]
  },
  {
    'tfOpName': 'Split',
    'dlOpName': 'split',
    'category': 'slice_join',
    'params': [
      {
        'tfInputIndex': 0,
        'dlParamName': 'axis',
        'type': 'number',
        'defaultValue': 0
      },
      {'tfInputIndex': 1, 'dlParamName': 'x', 'type': 'tensor'}, {
        'tfParamName': 'num_split',
        'dlParamName': 'numOrSizeSplits',
        'type': 'number',
        'defaultValue': 1
      }
    ]
  }
];
