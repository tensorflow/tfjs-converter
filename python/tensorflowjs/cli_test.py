# Copyright 2019 Google LLC
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
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import unittest
import tempfile
import os
import shutil
import tensorflow as tf
from tensorflow.python.eager import def_function
from tensorflow.python.ops import variables
from tensorflow.python.training.tracking import tracking
from tensorflow.python.saved_model.save import save

from tensorflowjs import cli

SAVED_MODEL_DIR = 'saved_model'
HD5_FILE_NAME = 'test.HD5'


class CliTest(unittest.TestCase):
  def setUp(self):
    self._tmp_dir = tempfile.mkdtemp()
    super(CliTest, self).setUp()

  def tearDown(self):
    if os.path.isdir(self._tmp_dir):
      shutil.rmtree(self._tmp_dir)
    super(CliTest, self).tearDown()

  def _create_hd5_file(self):
    filename = os.path.join(self._tmp_dir, 'test.HD5')
    open(filename, 'a').close()

  def _create_saved_model(self):
    """Test a basic model with functions to make sure functions are inlined."""
    input_data = tf.constant(1., shape=[1])
    root = tracking.AutoTrackable()
    root.v1 = variables.Variable(3.)
    root.v2 = variables.Variable(2.)
    root.f = def_function.function(lambda x: root.v1 * root.v2 * x)
    to_save = root.f.get_concrete_function(input_data)

    save_dir = os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    save(root, save_dir, to_save)

  def testQuantizationType(self):
    self.assertEqual(2, cli.quantization_type('1/2'))
    self.assertEqual(1, cli.quantization_type('1/4'))
    self.assertEqual(None, cli.quantization_type('1'))

  def testOfValues(self):
    answers = {'input_path': 'abc', 'input_format': '123'}
    self.assertEqual(True, cli.of_values(answers, 'input_path', ['abc']))
    self.assertEqual(False, cli.of_values(answers, 'input_path', ['abd']))
    self.assertEqual(False, cli.of_values(answers, 'input_format2', ['abc']))

  def testInputPathMessage(self):
    answers = {'input_format': 'keras'}
    self.assertEqual("The original path seems to be wrong, "
                     "what is the path of input HDF5 file?",
                     cli.input_path_message(answers))

    answers = {'input_format': 'tf_hub'}
    self.assertEqual("The original path seems to be wrong, "
                     "what is the TFHub module URL?",
                     cli.input_path_message(answers))

    answers = {'input_format': 'tf_saved_model'}
    self.assertEqual("The original path seems to be wrong, "
                     "what is the directory that contains the model?",
                     cli.input_path_message(answers))

  def testValidateInputPathForTFHub(self):
    self.assertNotEqual(True, cli.validate_input_path(self._tmp_dir, 'tf_hub'))
    self.assertEqual(True,
                     cli.validate_input_path("https://tfhub.dev/mobilenet",
                                             'tf_hub'))

  def testValidateInputPathForSavedModel(self):
    self.assertNotEqual(True, cli.validate_input_path(
        self._tmp_dir, 'tf_saved_model'))
    self._create_saved_model()
    save_dir = os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    self.assertEqual(True, cli.validate_input_path(
        save_dir, 'tf_saved_model'))

  def testValidateInputPathForKerasSavedModel(self):
    self.assertNotEqual(True, cli.validate_input_path(
        self._tmp_dir, 'keras_saved_model'))
    self._create_saved_model()
    save_dir = os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    self.assertEqual(True, cli.validate_input_path(
        save_dir, 'keras_saved_model'))

  def testValidateInputPathForKerasModel(self):
    self.assertNotEqual(True, cli.validate_input_path(self._tmp_dir, 'keras'))
    self._create_hd5_file()
    save_dir = os.path.join(self._tmp_dir, HD5_FILE_NAME)
    self.assertEqual(True, cli.validate_input_path(
        save_dir, 'keras'))

  def testValidateOutputPath(self):
    self.assertNotEqual(True, cli.validate_output_path(self._tmp_dir))
    output_dir = os.path.join(self._tmp_dir, 'test')
    self.assertEqual(True, cli.validate_output_path(output_dir))

  def testAvailableTags(self):
    self._create_saved_model()
    save_dir = os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    self.assertEqual(['serve'], cli.available_tags(
        {'input_path': save_dir,
         'input_format': 'tf_saved_model'}))

  def testAvailableSignatureNames(self):
    self._create_saved_model()
    save_dir = os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    self.assertEqual(['__saved_model_init_op', 'serving_default'],
                     list(map(lambda x: x['value'],
                     cli.available_signature_names(
                         {'input_path': save_dir,
                          'input_format': 'tf_saved_model',
                          'saved_model_tags': 'serve'}))))

  def testGenerateCommandForSavedModel(self):
    options = {'input_format': 'tf_saved_model',
               'input_path': 'tmp/saved_model',
               'saved_model_tags': 'test',
               'signature_name': 'test_default',
               'quantization_bytes': 2,
               'skip_op_check': False,
               'strip_debug_ops': True,
               'output_path': 'tmp/web_model'}

    self.assertEqual(['--input_format=tf_saved_model',
                      '--quantization_bytes=2', '--saved_model_tags=test',
                      '--signature_name=test_default', '--strip_debug_ops=True',
                      'tmp/saved_model', 'tmp/web_model'],
                     cli.generate_arguments(options))

  def testGenerateCommandForKerasSavedModel(self):
    options = {'input_format': 'tf_keras_saved_model',
               'output_format': 'tfjs_layers_model',
               'input_path': 'tmp/saved_model',
               'saved_model_tags': 'test',
               'signature_name': 'test_default',
               'quantization_bytes': 1,
               'skip_op_check': True,
               'strip_debug_ops': False,
               'output_path': 'tmp/web_model'}

    self.assertEqual(['--input_format=tf_keras_saved_model',
                      '--output_format=tfjs_layers_model',
                      '--quantization_bytes=1', '--saved_model_tags=test',
                      '--signature_name=test_default', '--skip_op_check',
                      '--strip_debug_ops=False', 'tmp/saved_model',
                      'tmp/web_model'],
                     cli.generate_arguments(options))

  def testGenerateCommandForKerasModel(self):
    options = {'input_format': 'keras',
               'input_path': 'tmp/model.HD5',
               'quantization_bytes': 1,
               'output_path': 'tmp/web_model'}

    self.assertEqual(['--input_format=keras', '--quantization_bytes=1',
                      'tmp/model.HD5', 'tmp/web_model'],
                     cli.generate_arguments(options))

  def testGenerateCommandForLayerModel(self):
    options = {'input_format': 'tfjs_layers_model',
               'output_format': 'keras',
               'input_path': 'tmp/model.json',
               'quantization_bytes': 1,
               'output_path': 'tmp/web_model'}

    self.assertEqual(['--input_format=tfjs_layers_model',
                      '--output_format=keras',
                      '--quantization_bytes=1', 'tmp/model.json',
                      'tmp/web_model'],
                     cli.generate_arguments(options))


if __name__ == '__main__':
  unittest.main()
