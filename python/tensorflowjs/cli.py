# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""Interactive command line tool for tensorflow.js model conversion."""

from __future__ import print_function, unicode_literals

import os
import re
import json

from PyInquirer import prompt
from examples import custom_style_3
from tensorflow.python.saved_model.loader_impl import parse_saved_model
from tensorflow.core.framework import types_pb2
from tensorflowjs.converters.converter import main as convert
# regex for recognizing valid url for TFHub module.
URL_REGEX = re.compile(
    # http:// or https://
    r'^(?:http)s?://', re.IGNORECASE)

DETECTED_INPUT_FORMAT = 'detected_input_format'
KERAS_SAVED_MODEL = 'keras_saved_model'
KERAS_MODEL = 'keras'
TF_SAVED_MODEL = 'tf_saved_model'
TF_HUB = 'tf_hub'
TFJS_GRAPH_MODEL = 'tfjs_keras_model'
TFJS_LAYERS_MODEL = 'tfjs_layers_model'


def quantization_type(value):
  """Determine the quantization type based on user selection.
  Args:
    value: user selected value.
  """
  answer = None
  try:
    if '1/2' in value:
      answer = 2
    elif '1/4' in value:
      answer = 1
  except ValueError:
    answer = None
  return answer


def of_values(answers, key, values):
  """Determine user's answer for the key is in the value list.
  Args:
    answer: Dict of user's answers to the questions.
    key: question key.
    values: List of values to check from.
  """
  try:
    value = answers[key]
    return value in values
  except KeyError:
    return False


def getTFJSModelType(file):
  with open(file) as f:
    data = json.load(f)
    return data['format']


def detect_input_format(answers):
  """Determine the input format from model's input path or file.
  Args:
    answer: Dict of user's answers to the questions
  """
  value = answers['input_path']
  if re.match(URL_REGEX, value):
    answers[DETECTED_INPUT_FORMAT] = TF_HUB
  elif (os.path.isdir(value) and
        any(fname.endswith('.pb') for fname in os.listdir(value))):
    answers[DETECTED_INPUT_FORMAT] = TF_SAVED_MODEL
  elif os.path.isfile(value) and value.endswith('.HDF5'):
    answers[DETECTED_INPUT_FORMAT] = KERAS_MODEL
  elif os.path.isdir(value) and value.endswith('model.json'):
    if getTFJSModelType(value) == 'layers-model':
      answers[DETECTED_INPUT_FORMAT] = TFJS_LAYERS_MODEL
  elif os.path.isdir(value):
    for fname in os.listdir(value):
      if fname.endswith('model.json'):
        filename = os.path.join(value, fname)
        if getTFJSModelType(filename) == 'layers-model':
          answers['input_path'] = os.path.join(value, fname)
          answers[DETECTED_INPUT_FORMAT] = TFJS_LAYERS_MODEL
          break


def input_path_message(answers):
  """Determine question for model's input path.
  Args:
    answer: Dict of user's answers to the questions
  """
  answer = answers['input_format']
  message = 'The original path seems to be wrong, '
  if answer == KERAS_MODEL:
    return message + 'what is the path of input HDF5 file?'
  elif answer == TF_HUB:
    return message + 'what is the TFHub module URL?'
  else:
    return message + 'what is the directory that contains the model?'


def validate_input_path(value, input_format):
  """validate the input path for given input format.
  Args:
    value: input path of the model.
    input_format: model format string.
  """
  value = os.path.expanduser(value)
  if not value:
    return 'Please enter a valid path'
  if input_format == TF_HUB:
    if re.match(URL_REGEX, value) is None:
      return 'This is not an valid url for TFHub module: %s' % value
  elif not os.path.exists(value):
    return 'Nonexistent path for the model: %s' % value
  if input_format in [KERAS_SAVED_MODEL, TF_SAVED_MODEL]:
    if not os.path.isdir(value):
      return 'The path provided is not a directory: %s' % value
    if not any(fname.endswith('.pb') for fname in os.listdir(value)):
      return 'This is an invalid saved model directory: %s' % value
  if input_format == TFJS_LAYERS_MODEL:
    if not os.path.isfile(value):
      return 'The path provided is not a file: %s' % value
  if input_format == KERAS_MODEL:
    if not os.path.isfile(value):
      return 'The path provided is not a file: %s' % value
  return True


def validate_output_path(value):
  """validate the input path for given input format.
  Args:
    value: input path of the model.
    input_format: model format string.
  """
  value = os.path.expanduser(value)
  if not value:
    return 'Please provide a valid output path'
  if os.path.exists(value):
    return 'The output path already exists: %s' % value
  return True


def generate_arguments(params):
  """generate the tensorflowjs command string for the selected params.
  Args:
    params: user selected parameters for the conversion.
  """
  args = []
  not_param_list = [DETECTED_INPUT_FORMAT, 'input_path', 'output_path']
  no_false_param = ['split_weights_by_layer', 'skip_op_check']
  for key, value in sorted(params.items()):
    if key not in not_param_list and value is not None:
      if key in no_false_param:
        if value is True:
          args.append('--%s' % (key))
      else:
        args.append('--%s=%s' % (key, value))

  args.append(params['input_path'])
  args.append(params['output_path'])
  return args


def is_saved_model(answers):
  """check if the input path contains saved model.
  Args:
    params: user selected parameters for the conversion.
  """
  return answers['input_format'] == TF_SAVED_MODEL or \
      answers['input_format'] == KERAS_SAVED_MODEL and \
      answers['output_format'] == TFJS_GRAPH_MODEL


def available_output_formats(answers):
  """generate the output formats for given input format.
  Args:
    ansowers: user selected parameter dict.
  """
  input_format = answers['input_format']
  if input_format == KERAS_SAVED_MODEL:
    return [{
        'key': 'g',
        'name': 'Tensorflow.js Graph Model',
        'value': TFJS_GRAPH_MODEL,
    }, {
        'key': 'l',
        'name': 'TensoFlow.js Layers Model',
        'value': TFJS_LAYERS_MODEL,
    }]
  if input_format == TFJS_LAYERS_MODEL:
    return [{
        'key': 'k',
        'name': 'Keras Model (HDF5)',
        'value': KERAS_MODEL,
    }, {
        'key': 'l',
        'name': 'TensoFlow.js Layers Model',
        'value': TFJS_LAYERS_MODEL,
    }]
  return []


def available_tags(answers):
  """generate the available saved model tags from the proto file.
  Args:
    ansowers: user selected parameter dict.
  """
  if is_saved_model(answers):
    saved_model = parse_saved_model(answers['input_path'])
    tags = []
    for meta_graph in saved_model.meta_graphs:
      tags.append(",".join(meta_graph.meta_info_def.tags))
    return tags
  return []


def available_signature_names(answers):
  """generate the available saved model signatures from the proto file
    and selected tags.
  Args:
    ansowers: user selected parameter dict.
  """
  if is_saved_model(answers):
    path = answers['input_path']
    tags = answers['saved_model_tags']
    saved_model = parse_saved_model(path)
    for meta_graph in saved_model.meta_graphs:
      if tags == ",".join(meta_graph.meta_info_def.tags):
        signatures = []
        for key in meta_graph.signature_def:
          input_nodes = meta_graph.signature_def[key].inputs
          output_nodes = meta_graph.signature_def[key].outputs
          signatures.append(
              {'value': key,
               'name': format_signature(key, input_nodes, output_nodes)})
        return signatures
  return []


def format_signature(name, input_nodes, output_nodes):
  string = "signature name: %s\n" % name
  string += "        inputs: \n%s" % format_nodes(input_nodes)
  string += "        outputs: \n%s" % format_nodes(output_nodes)
  return string


def format_nodes(nodes):
  string = ""
  for key in nodes:
    value = nodes[key]
    string += "              name: %s, " % value.name
    string += "dtype: %s, " % types_pb2.DataType.Name(value.dtype)
    if value.tensor_shape.unknown_rank:
      string += "shape: Unknown\n"
    else:
      string += "shape: %s\n" % [x.size for x in value.tensor_shape.dim]
  return string


def input_format_string(base, target_format, detected_format):
  if target_format == detected_format:
    return base + ' *'
  else:
    return base


def input_format_message(answers):
  message = 'What is your input model format? '
  if DETECTED_INPUT_FORMAT in answers:
    message += '(auto-detected format is marked with *)'
  else:
    message += '(model format cannot be detected.) '
  return message


def input_formats(answers):
  detected_format = None
  if DETECTED_INPUT_FORMAT in answers:
    detected_format = answers[DETECTED_INPUT_FORMAT]
  formats = [{
      'key': 'k',
      'name': input_format_string('Keras (HDF5)', KERAS_MODEL,
                                  detected_format),
      'value': KERAS_MODEL
  }, {
      'key': 'e',
      'name': input_format_string('Tensorflow Keras Saved Model',
                                  KERAS_SAVED_MODEL,
                                  detected_format),
      'value': KERAS_SAVED_MODEL,
  }, {
      'key': 's',
      'name': input_format_string('Tensorflow Saved Model',
                                  TF_SAVED_MODEL,
                                  detected_format),
      'value': TF_SAVED_MODEL,
  }, {
      'key': 'h',
      'name': input_format_string('TFHub Module',
                                  TF_HUB,
                                  detected_format),
      'value': TF_HUB,
  }, {
      'key': 'l',
      'name': input_format_string('TensoFlow.js Layers Model',
                                  TFJS_LAYERS_MODEL,
                                  detected_format),
      'value': TFJS_LAYERS_MODEL,
  }]
  formats.sort(key=lambda x: x['value'] != detected_format)
  return formats


def main():
  print('Weclome to TensorFlow.js converter.')
  input_path = [{
      'type': 'input',
      'name': 'input_path',
      'message': 'Please provide the path of model file or '
                 'the directory that contains model files. \n'
                 'If you are converting TFHub module please provide the URL.',
      'filter': os.path.expanduser,
      'validate':
          lambda value: 'Please enter a valid path' if not value else True
  }]

  input_params = prompt(input_path, style=custom_style_3)
  detect_input_format(input_params)

  formats = [
      {
          'type': 'list',
          'name': 'input_format',
          'message': input_format_message(input_params),
          'choices': input_formats(input_params)},
      {
          'type': 'list',
          'name': 'output_format',
          'message': 'What is your output format?',
          'choices': available_output_formats,
          'when': lambda answers: of_values(answers, 'input_format',
                                            [KERAS_SAVED_MODEL,
                                             TFJS_LAYERS_MODEL])
      }
  ]
  options = prompt(formats, input_params, style=custom_style_3)
  message = input_path_message(options)

  questions = [
      {
          'type': 'input',
          'name': 'input_path',
          'message': message,
          'filter': os.path.expanduser,
          'validate': lambda value: validate_input_path(
              value, options['input_format']),
          'when': lambda answers: (DETECTED_INPUT_FORMAT not in answers)

      },
      {
          'type': 'list',
          'name': 'saved_model_tags',
          'choices': available_tags,
          'message': 'What is tags for the saved model?',
          'when': is_saved_model
      },
      {
          'type': 'list',
          'name': 'signature_name',
          'message': 'What is signature name of the model?',
          'choices': available_signature_names,
          'when': is_saved_model
      },
      {
          'type': 'list',
          'name': 'quantization_bytes',
          'message': 'Do you want to compress the model? '
                     '(this will decrease the model precision.)',
          'choices': ['No compression, no accuracy loss.',
                      '2x compression, medium accuracy loss.',
                      '4x compression, highest accuracy loss.'],
          'filter': quantization_type
      },
      {
          'type': 'input',
          'name': 'weight_shard_size_byte',
          'message': 'Please enter shard size (in bytes) of the weight files?',
          'default': str(4 * 1024 * 1024),
          'when': lambda answers: of_values(answers, 'output_format',
                                            [TFJS_LAYERS_MODEL])
      },
      {
          'type': 'confirm',
          'name': 'split_weights_by_layer',
          'message': 'Do you want to split weights by layers?',
          'default': False,
          'when': lambda answers: of_values(answers, 'input_format',
                                            [TFJS_LAYERS_MODEL])
      },
      {
          'type': 'confirm',
          'name': 'skip_op_check',
          'message': 'Do you want to skip op validation? \n'
                     'This will allow conversion of unsupported ops, \n'
                     'you can implement them as custom ops in tfjs-converter.',
          'default': False,
          'when': lambda answers: of_values(answers, 'input_format',
                                            [TF_SAVED_MODEL, TF_HUB])
      },
      {
          'type': 'confirm',
          'name': 'strip_debug_ops',
          'message': 'Do you want to strip debug ops? \n'
                     'This will improve model execution performance.',
          'default': True,
          'when': lambda answers: of_values(answers, 'input_format',
                                            [TF_SAVED_MODEL, TF_HUB])
      },
      {
          'type': 'input',
          'name': 'output_path',
          'message': 'Which directory do you want to save '
                     'the converted model in?',
          'filter': os.path.expanduser,
          'validate': validate_output_path
      }
  ]
  params = prompt(questions, options, style=custom_style_3)

  arguments = generate_arguments(params)
  convert(arguments)
  print('file generated after conversion:')
  with os.scandir(params['output_path']) as it:
    for entry in it:
      print(entry.name,
            os.path.getsize(os.path.join(params['output_path'], entry.name)))


if __name__ == '__main__':
  main()
