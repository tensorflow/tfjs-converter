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
"""Unit tests for keras_tfjs_loader."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import os
import shutil
import tempfile
import unittest

import keras
import tensorflow as tf

from tensorflowjs.converters import keras_h5_conversion
from tensorflowjs.converters import keras_tfjs_loader


class LoadKerasModelTest(tf.test.TestCase):

  def setUp(self):
    self._tmp_dir = tempfile.mkdtemp()
    super(LoadKerasModelTest, self).setUp()

  def tearDown(self):
    if os.path.isdir(self._tmp_dir):
      shutil.rmtree(self._tmp_dir)
    tf.reset_default_graph()
    super(LoadKerasModelTest, self).tearDown()

  def _saveKerasModelForTest(self, path):
    model = keras.Sequential()
    model.add(keras.layers.Dense(
        2, input_shape=[12], bias_initializer='random_normal', name='dense'))
    model.add(keras.layers.Dense(
        8, bias_initializer='random_normal', name='foo/dense'))
    model.add(keras.layers.Dense(
        4, bias_initializer='random_normal', name='foo/bar/dense'))
    keras_h5_conversion.save_keras_model(model, path)
    return model

  def testLoadKerasModelAndWeights(self):
    """Test loading of model and its weights."""
    # Use separate tf.Graph and tf.Session contexts to prevent name collision.
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      model1 = self._saveKerasModelForTest(tfjs_path)
      model1_weight_values = model1.get_weights()

    with tf.Graph().as_default(), tf.Session():
      model2 = keras_tfjs_loader.load_keras_model(
          os.path.join(tfjs_path, 'model.json'))

      # Verify the equality of all the weight values.
      model2_weight_values = model2.get_weights()
      self.assertEqual(len(model1_weight_values), len(model2_weight_values))
      for model1_weight_value, model2_weight_value in zip(
          model1_weight_values, model2_weight_values):
        self.assertAllClose(model1_weight_value, model2_weight_value)

      # The two model JSONs should match exactly.
      self.assertEqual(model1.to_json(), model2.to_json())

  def testLoadKerasModelWithCurrentWorkingDirectoryRelativePath(self):
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      model1 = self._saveKerasModelForTest(tfjs_path)
      model1_weight_values = model1.get_weights()

    os.chdir(tfjs_path)
    with tf.Graph().as_default(), tf.Session():
      # Use a relative path under the current working directory.
      model2 = keras_tfjs_loader.load_keras_model('model.json')

      # Verify the equality of all the weight values.
      model2_weight_values = model2.get_weights()
      self.assertEqual(len(model1_weight_values), len(model2_weight_values))
      for model1_weight_value, model2_weight_value in zip(
          model1_weight_values, model2_weight_values):
        self.assertAllClose(model1_weight_value, model2_weight_value)

      # The two model JSONs should match exactly.
      self.assertEqual(model1.to_json(), model2.to_json())

  def testLoadKerasModelWithoutWeights(self):
    """Test loading of model topology only, without loading weight values."""
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      model1 = self._saveKerasModelForTest(tfjs_path)
      model1_weight_values = model1.get_weights()

    with tf.Graph().as_default(), tf.Session():
      model2 = keras_tfjs_loader.load_keras_model(
          os.path.join(tfjs_path, 'model.json'), load_weights=False)
      model2_weight_values = model2.get_weights()
      self.assertEqual(len(model1_weight_values), len(model2_weight_values))
      for model1_weight_value, model2_weight_value in zip(
          model1_weight_values, model2_weight_values):
        self.assertEqual(model1_weight_value.dtype,
                         model2_weight_value.dtype)
        self.assertEqual(model1_weight_value.shape,
                         model2_weight_value.shape)
        # The weights should be unequal, because `load_weights=False`.
        self.assertNotEqual(model1_weight_value.tobytes(),
                            model2_weight_value.tobytes())

      self.assertEqual(model1.to_json(), model2.to_json())

  def testLoadKerasModelFromNonDefaultWeightsPathWorks(self):
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      model1 = self._saveKerasModelForTest(tfjs_path)
      model1_weight_values = model1.get_weights()

      # Move the model.json file to a different folder.
      model_json_dir = os.path.join(tfjs_path, 'model_json_dir')
      os.makedirs(model_json_dir)
      new_model_json_path = os.path.join(model_json_dir, 'model.json')
      shutil.move(os.path.join(tfjs_path, 'model.json'), new_model_json_path)

    with tf.Graph().as_default(), tf.Session():
      model2 = keras_tfjs_loader.load_keras_model(
          new_model_json_path, weights_path_prefix=tfjs_path)

      # Verify the equality of all the weight values.
      model2_weight_values = model2.get_weights()
      self.assertEqual(len(model1_weight_values), len(model2_weight_values))
      for model1_weight_value, model2_weight_value in zip(
          model1_weight_values, model2_weight_values):
        self.assertAllClose(model1_weight_value, model2_weight_value)

      self.assertEqual(model1.to_json(), model2.to_json())

  def testLoadKerasModelWithUniqueNameScopeInTheSameGraphContext(self):
    """Test enabling unique name scope during model loading."""
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      model1 = self._saveKerasModelForTest(tfjs_path)
      model1_weight_values = model1.get_weights()

      model2 = keras_tfjs_loader.load_keras_model(
          os.path.join(tfjs_path, 'model.json'), use_unique_name_scope=True)

      model2_weight_values = model2.get_weights()
      self.assertEqual(len(model1_weight_values), len(model2_weight_values))
      for model1_weight_value, model2_weight_value in zip(
          model1_weight_values, model2_weight_values):
        self.assertAllClose(model1_weight_value, model2_weight_value)

      # Verify that model1's weight names are suffixes of model2's weight names.
      model1_weight_names = [w.name for w in model1.weights]
      model2_weight_names = [w.name for w in model2.weights]
      self.assertEqual(len(model1_weight_names), len(model2_weight_names))
      for name1, name2 in zip(model1_weight_names, model2_weight_names):
        self.assertTrue(name2.endswith(name1))

  def testLoadKerasModelFromDataBuffers(self):
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      model1 = self._saveKerasModelForTest(tfjs_path)
      model1_weight_values = model1.get_weights()

      with open(os.path.join(tfjs_path, 'model.json'), 'rt') as f:
        weights_manifest = json.load(f)['weightsManifest']

      data_buffers = []
      for group in weights_manifest:
        data_buffer = b''
        for path in group['paths']:
          with open(os.path.join(tfjs_path, path), 'rb') as f:
            data_buffer += f.read()

    with tf.Graph().as_default(), tf.Session():
      model2 = keras_tfjs_loader.load_keras_model(
          os.path.join(tfjs_path, 'model.json'),
          weights_data_buffers=data_buffers)

      # Verify the equality of all the weight values.
      model2_weight_values = model2.get_weights()
      self.assertEqual(len(model1_weight_values), len(model2_weight_values))
      for model1_weight_value, model2_weight_value in zip(
          model1_weight_values, model2_weight_values):
        self.assertAllClose(model1_weight_value, model2_weight_value)

      self.assertEqual(model1.to_json(), model2.to_json())

  def testLoadKerasModeFromNonexistentWeightsPathRaisesError(self):
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      self._saveKerasModelForTest(tfjs_path)
      with self.assertRaises(ValueError):
        keras_tfjs_loader.load_keras_model(
            os.path.join(tfjs_path, 'model.json'),
            weights_path_prefix=os.path.join(self._tmp_dir, 'nonexistent'))

  def testUsingBothWeightsDataBuffersAndWeightsPathPrefixRaisesError(self):
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      self._saveKerasModelForTest(tfjs_path)

      with self.assertRaises(ValueError):
        keras_tfjs_loader.load_keras_model(
            os.path.join(tfjs_path, 'model.json'),
            weights_data_buffers=[b'foo'], weights_path_prefix='bar')

  def testInvalidJSONRaisesError(self):
    with tf.Graph().as_default(), tf.Session():
      tfjs_path = os.path.join(self._tmp_dir, 'model_for_test')
      self._saveKerasModelForTest(tfjs_path)

      # Make some changes to the model.json file content to create an invalid
      # file content.
      model_json_path = os.path.join(tfjs_path, 'model.json')
      with open(model_json_path, 'rt') as f:
        model_json_content = f.read()
      with open(model_json_path, 'wt') as f:
        f.write('[' + model_json_content + ']')

      with self.assertRaises(TypeError):
        keras_tfjs_loader.load_keras_model(
            model_json_path,
            weights_data_buffers=[b'foo'], weights_path_prefix='bar')



if __name__ == '__main__':
  unittest.main()
