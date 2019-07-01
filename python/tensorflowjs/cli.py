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

from PyInquirer import prompt
from examples import custom_style_3
from tensorflow.python.saved_model.loader_impl import parse_saved_model

# regex for recognizing valid url for TFHub module.
URL_REGEX = re.compile(
    # http:// or https://
    r'^(?:http)s?://', re.IGNORECASE)


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


def input_path_message(answers):
  """Determine question for model's input path.
  Args:
    answer: Dict of user's answers to the questions
  """
  answer = answers['input_format']
  if answer == 'keras':
    return 'What is the path of input HDF5 file?'
  elif answer == 'tf_hub':
    return 'What is the TFHub module URL?'
  else:
    return 'What is the directory that contains the model?'


def validate_input_path(value, input_format):
  """validate the input path for given input format.
  Args:
    value: input path of the model.
    input_format: model format string.
  """
  value = os.path.expanduser(value)
  if input_format == 'tf_hub':
    if re.match(URL_REGEX, value) is None:
      return 'This is not an valid url for TFHub module: %s' % value
  elif not os.path.exists(value):
    return 'Nonexistent path for the model: %s' % value
  if input_format in ['keras_saved_model', 'tf_saved_model']:
    if not os.path.isdir(value):
      return 'The path provided is not a directory: %s' % value
    if not any(fname.endswith('.pb') for fname in os.listdir(value)):
      return 'This is an invalid saved model directory: %s' % value
  if input_format == 'tfjs_layers_model':
    if not os.path.isfile(value):
      return 'The path provided is not a file: %s' % value
  if input_format == 'keras':
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
  if os.path.exists(value):
    return 'The output path already exists: %s' % value
  return True


def generate_command(params):
  """generate the tensorflowjs command string for the selected params.
  Args:
    params: user selected parameters for the conversion.
  """
  args = 'tensorflowjs_converter'
  not_param_list = ['input_path', 'output_path']
  no_false_param = ['split_weights_by_layer', 'skip_op_check']
  for key, value in sorted(params.items()):
    if key not in not_param_list and value is not None:
      if key in no_false_param:
        if value is True:
          args += ' --%s' % (key)
      else:
        args += ' --%s=%s' % (key, value)

  args += ' %s %s' % (params['input_path'], params['output_path'])
  return args

def is_saved_model(answers):
  """check if the input path contains saved model.
  Args:
    params: user selected parameters for the conversion.
  """
  return answers['input_format'] == 'tf_saved_model' or \
         answers['input_format'] == 'keras_saved_model' and \
         answers['output_format'] == 'tfjs_graph_model'

def available_output_formats(answers):
  """generate the output formats for given input format.
  Args:
    ansowers: user selected parameter dict.
  """
  input_format = answers['input_format']
  if input_format == 'keras_saved_model':
    return ['tfjs_graph_model', 'tfjs_layers_model']
  if input_format == 'tfjs_layers_model':
    return ['keras', 'tfjs_graph_model']
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
        return meta_graph.signature_def.keys()
  return []


def main():
  print('Weclome to TensorFlow.js converter.')

  formats = [
      {
          'type': 'list',
          'name': 'input_format',
          'message': 'What is your input format?',
          'choices': ['keras', 'keras_saved_model',
                      'tf_saved_model', 'tf_hub', 'tfjs_layers_model']
      },
      {
          'type': 'list',
          'name': 'output_format',
          'message': 'What is your output format?',
          'choices': available_output_formats,
          'when': lambda answers: of_values(answers, 'input_format',
                                            ['keras_saved_model',
                                             'tfjs_layers_model'])
      }
  ]

  options = prompt(formats, style=custom_style_3)
  message = input_path_message(options)

  questions = [
      {
          'type': 'input',
          'name': 'input_path',
          'message': message,
          'filter': os.path.expanduser,
          'validate': lambda value: validate_input_path(
              value, options['input_format'])
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
          'choices': ['No compression',
                      'compress weights to 1/2 the size',
                      'compress weights to 1/4 the size'],
          'filter': quantization_type
      },
      {
          'type': 'input',
          'name': 'weight_shard_size_byte',
          'message': 'Please enter shard size (in bytes) of the weight files?',
          'default': str(4 * 1024 * 1024),
          'when': lambda answers: of_values(answers, 'output_format',
                                            ['tfjs_layers_model'])
      },
      {
          'type': 'confirm',
          'name': 'split_weights_by_layer',
          'message': 'Do you want to split weights by layers?',
          'default': False,
          'when': lambda answers: of_values(answers, 'input_format',
                                            ['tfjs_layers_model'])
      },
      {
          'type': 'confirm',
          'name': 'skip_op_check',
          'message': 'Do you want to skip op validation?',
          'default': False,
          'when': lambda answers: of_values(answers, 'input_format',
                                            ['tf_saved_model', 'tf_hub'])
      },
      {
          'type': 'confirm',
          'name': 'strip_debug_ops',
          'message': 'Do you want to strip debug ops?',
          'default': True,
          'when': lambda answers: of_values(answers, 'input_format',
                                            ['tf_saved_model', 'tf_hub'])
      },
      {
          'type': 'input',
          'name': 'output_path',
          'message': 'Which directory do you want save the converted model?',
          'filter': os.path.expanduser,
          'validate': validate_output_path
      }
  ]
  params = prompt(questions, options, style=custom_style_3)

  command = generate_command(params)
  print(command)
  os.system(command)


if __name__ == '__main__':
  main()
