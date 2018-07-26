export const json = [
  {
    'tfOpName': 'MatMul',
    'dlOpName': 'matMul',
    'category': 'matrices',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor'},
      {'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor'}, {
        'tfParamName': 'transpose_a',
        'dlParamName': 'transposeA',
        'type': 'bool',
        'defaultValue': false
      },
      {
        'tfParamName': 'transpose_b',
        'dlParamName': 'transposeB',
        'type': 'bool',
        'defaultValue': false
      },
      {
        'tfParamName': 'T',
        'dlParamName': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'Transpose',
    'dlOpName': 'transpose',
    'category': 'matrices',
    'params': [
      {'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor'},
      {'tfParamName': 'perm', 'dlParamName': 'perm', 'type': 'number[]'}, {
        'tfParamName': 'T',
        'dlParamName': 'dtype',
        'type': 'dtype',
        'notSupported': true
      }
    ]
  }
];
