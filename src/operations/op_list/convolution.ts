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
    'tfOpName': 'AvgPool',
    'category': 'convolution',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'strides'},
        'name': 'strides',
        'type': 'number[]'
      },
      {attrMapper: {'tfName': 'padding'}, 'name': 'pad', 'type': 'string'}, {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string',
        'notSupported': true
      },
      {
        attrMapper: {'tfName': 'ksize'},
        'name': 'kernelSize',
        'type': 'number[]'
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
    'tfOpName': 'MaxPool',
    'category': 'convolution',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'strides'},
        'name': 'strides',
        'type': 'number[]'
      },
      {attrMapper: {'tfName': 'padding'}, 'name': 'pad', 'type': 'string'}, {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string',
        'notSupported': true
      },
      {
        attrMapper: {'tfName': 'ksize'},
        'name': 'kernelSize',
        'type': 'number[]'
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
    'tfOpName': 'Conv1D',
    'category': 'convolution',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'filter', 'type': 'tensor'},
      {attrMapper: {'tfName': 'stride'}, 'name': 'stride', 'type': 'number'},
      {attrMapper: {'tfName': 'padding'}, 'name': 'pad', 'type': 'string'}, {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string',
        'defaultValue': 'NWC'
      },
      {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      },
      {
        attrMapper: {'tfName': 'dilation'},
        'name': 'dilation',
        'type': 'number',
        'defaultValue': 1
      }
    ]
  },
  {
    'tfOpName': 'Conv2D',
    'category': 'convolution',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'filter', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'T'},
        'name': 'dtype',
        'type': 'dtype',
        'notSupported': true
      },
      {
        attrMapper: {'tfName': 'strides'},
        'name': 'strides',
        'type': 'number[]'
      },
      {attrMapper: {'tfName': 'padding'}, 'name': 'pad', 'type': 'string'}, {
        attrMapper: {'tfName': 'useCudnnOnGpu'},
        'name': 'useCudnnOnGpu',
        'type': 'bool'
      },
      {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string',
        'defaultValue': 'NHWC'
      },
      {
        attrMapper: {'tfName': 'dilations'},
        'name': 'dilations',
        'type': 'number[]'
      }
    ]
  },
  {
    'tfOpName': 'Conv2DBackpropInput',
    'category': 'convolution',
    'params': [
      {inputMapper: {'start': 2}, 'name': 'x', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'filter', 'type': 'tensor'},
      {inputMapper: {'start': 0}, 'name': 'outputShape', 'type': 'number[]'}, {
        attrMapper: {'tfName': 'strides'},
        'name': 'strides',
        'type': 'number[]'
      },
      {attrMapper: {'tfName': 'padding'}, 'name': 'pad', 'type': 'string'}, {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string',
        'notSupported': true
      }
    ]
  },
  {
    'tfOpName': 'DepthwiseConv2d',
    'category': 'convolution',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'input', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'filter', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'strides'},
        'name': 'strides',
        'type': 'number[]'
      },
      {attrMapper: {'tfName': 'padding'}, 'name': 'pad', 'type': 'string'}, {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string',
        'defaultValue': 'NHWC'
      },
      {
        attrMapper: {'tfName': 'dilations'},
        'name': 'dilations',
        'type': 'number[]'
      }
    ]
  },
  {
    'tfOpName': 'DepthwiseConv2dNative',
    'category': 'convolution',
    'params': [
      {inputMapper: {'start': 0}, 'name': 'input', 'type': 'tensor'},
      {inputMapper: {'start': 1}, 'name': 'filter', 'type': 'tensor'}, {
        attrMapper: {'tfName': 'strides'},
        'name': 'strides',
        'type': 'number[]'
      },
      {attrMapper: {'tfName': 'padding'}, 'name': 'pad', 'type': 'string'}, {
        attrMapper: {'tfName': 'data_format'},
        'name': 'dataFormat',
        'type': 'string',
        'defaultValue': 'NHWC'
      },
      {
        attrMapper: {'tfName': 'dilations'},
        'name': 'dilations',
        'type': 'number[]'
      }
    ]
  }
];
