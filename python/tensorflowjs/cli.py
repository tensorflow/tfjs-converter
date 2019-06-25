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
"""Interactive command line tool for building tensorflow.js conversion command."""

from __future__ import print_function, unicode_literals

import os
import re

from PyInquirer import prompt
from examples import custom_style_3
from tensorflow.python.saved_model.loader_impl import parse_saved_model

'''regex for recognizing valid url for TFHub module.'''
URL_REGEX = re.compile(
    r'^(?:http|ftp)s?://'  # http:// or https://
    # domain...
    r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
    r'localhost|'  # localhost...
    r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
    r'(?::\d+)?'  # optional port
    r'(?:/?|[/?]\S+)$', re.IGNORECASE)


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
  """Determine user's answers for the key is within the value list.
  Args:
    answer: Dict of user's answers to the questions.
    key: question key.
    values: List of values to check from.
  """
  value = answers[key]
  return value in values


def input_path_message(answers):
  """Determine question for model's input path.
  Args:
    answer: Dict of user's answers to the questions.
    key: question key.
  """
  answer = answers['input_format']
  if answer == 'keras':
    return 'What is the path of input HDF5 file?'
  elif answer == 'tfhub':
    return 'What is the TFHub module URL?'
  else:
    return 'What is the directory that contains the model?'


def validate_input_path(value, input_format):
  """validate the input path for given input format.
  Args:
    value: input path of the model.
    input_format: model format string.
  """
  if not os.path.exists(value):
    return 'Nonexistent path for the model: %s' % value
  if input_format in ['keras_saved_model', 'tf_saved_model']:
    if not os.path.isdir(value):
      return 'The path provided is not a directory: %s' % value
    if not any(fname.endswith('.pb') for fname in os.listdir(value)):
      return 'This is an invalid saved model directory: %s' % value
  if input_format == 'tfhub':
    if re.match(URL_REGEX, value) is None:
      return 'This is not an valid url for TFHub module: %s' % value
  if input_format == 'tfjs_layers_model':
    if not os.path.isfile(value):
      return 'The path provided is not a file: %s' % value
    if not os.path.exists(value + '/model.json'):
      return 'This is not a valid directory for layers model: %s' % value
  return True


def validate_output_path(value):
  if os.path.exists(value):
    return 'The output path already exists: %s' % value
  return True


def default_signature_name(answers):
  if of_values(answers, 'input_format', ['tf_saved_model']):
    return 'serving_default'
  return ''


def generate_command(options, params):
  params.update(options)
  args = 'tensorflowjs_converter'
  not_param_list = ['input_path', 'output_path']
  no_false_param = ['split_weights_by_layer', 'skip_op_check']
  for key, value in params.items():
    if key not in not_param_list and value is not None:
      if key not in no_false_param or value is not False:
        args += ' --%s=%s' % (key, value)

  args += ' %s %s' % (params['input_path'], params['output_path'])
  return args

def available_tags(answers):
  saved_model = parse_saved_model(answers['input_path'])
  tags = []
  for meta_graph in saved_model.meta_graphs:
    tags.append(",".join(meta_graph.meta_info_def.tags))
  return tags

def available_signature_names(answers):
  path = answers['input_path']
  tags = answers['saved_model_tags']
  saved_model = parse_saved_model(path)
  for meta_graph in saved_model.meta_graphs:
    if tags == ",".join(meta_graph.meta_info_def.tags):
      return meta_graph.signature_def.keys()
  return []

def main():
  print('Weclome to TensorFlow.js converter.')

  input_format = [
      {
          'type': 'list',
          'name': 'input_format',
          'message': 'What is your input format?',
          'choices': ['keras', 'keras_saved_model',
                      'tf_saved_model', 'tf_hub', 'tfjs_layers_model',
                      'tensorflowjs']
      }
  ]

  options = prompt(input_format, style=custom_style_3)
  message = input_path_message(options)

  questions = [
      {
          'type': 'input',
          'name': 'input_path',
          'message': message,
          'validate': lambda value: validate_input_path(value, options['input_format'])
      },
      {
          'type': 'list',
          'name': 'saved_model_tags',
          'choices': available_tags,
          'message': 'What is tags for the saved model?',
          'when': lambda answers: of_values(options, 'input_format',
                                            ['tf_saved_model'])
      },
      {
          'type': 'list',
          'name': 'signature_name',
          'message': 'What is signature name of the model?',
          'choices': available_signature_names,
          'when': lambda answers: of_values(options, 'input_format',
                                            ['tf_saved_model'])
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
          'type': 'confirm',
          'name': 'split_weights_by_layer',
          'message': 'Do you want to split weights by layers?',
          'default': False,
          'when': lambda answers: of_values(options, 'input_format',
                                            ['tf_layers_model'])
      },
      {
          'type': 'confirm',
          'name': 'skip_op_check',
          'message': 'Do you want to skip op validation?',
          'default': False,
          'when': lambda answers: of_values(options, 'input_format',
                                            ['tf_saved_model', 'tfhub'])
      },
      {
          'type': 'confirm',
          'name': 'strip_debug_ops',
          'message': 'Do you want to strip debug ops?',
          'default': False,
          'when': lambda answers: of_values(options, 'input_format',
                                            ['tf_saved_model', 'tfhub'])
      },
      {
          'type': 'input',
          'name': 'output_path',
          'message': 'Which directory do you want save the converted model?',
          'validate': lambda value: validate_output_path(value)
      }
  ]
  params = prompt(questions, style=custom_style_3)

  command = generate_command(options, params)
  print(command)
  os.system(command)


if __name__ == '__main__':
  main()
