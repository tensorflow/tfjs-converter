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
"""Unit tests for artifact conversion to and from Python Keras."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import os
import shutil
import tempfile
import unittest

import h5py
import keras
import numpy as np

from tensorflowjs.converters import keras_h5_conversion


class ConvertH5WeightsTest(unittest.TestCase):

  def setUp(self):
    self._tmp_dir = tempfile.mkdtemp()
    self._converter = keras_h5_conversion.HDF5Converter()
    super(ConvertH5WeightsTest, self).setUp()

  def tearDown(self):
    if os.path.isdir(self._tmp_dir):
      shutil.rmtree(self._tmp_dir)
    super(ConvertH5WeightsTest, self).tearDown()

  def testConvertWeightsFromSimpleModel(self):
    input_tensor = keras.layers.Input((3,))
    dense1 = keras.layers.Dense(
        4, use_bias=True, kernel_initializer='ones', bias_initializer='zeros',
        name='MyDense10')(input_tensor)
    output = keras.layers.Dense(
        2, use_bias=False, kernel_initializer='ones', name='MyDense20')(dense1)
    model = keras.models.Model(inputs=[input_tensor], outputs=[output])
    h5_path = os.path.join(self._tmp_dir, 'MyModel.h5')
    model.save_weights(h5_path)

    # Load the saved weights as a JSON string.
    groups = self._converter.h5_weights_to_tfjs_format(h5py.File(h5_path))

    # Check the loaded weights.
    weights1 = groups[0]
    self.assertEqual(2, len(weights1))
    kernel1 = weights1[0]
    self.assertEqual('MyDense10/kernel', kernel1['name'])
    self.assertEqual('float32', kernel1['data'].dtype)
    self.assertEqual((3, 4), kernel1['data'].shape)
    self.assertTrue(np.allclose(np.ones([3, 4]), kernel1['data']))
    bias1 = weights1[1]
    self.assertEqual('MyDense10/bias', bias1['name'])
    self.assertEqual('float32', bias1['data'].dtype)
    self.assertEqual((4,), bias1['data'].shape)
    self.assertTrue(np.allclose(np.zeros([4]), bias1['data']))
    weights2 = groups[1]
    self.assertEqual(1, len(weights2))
    kernel2 = weights2[0]
    self.assertEqual('MyDense20/kernel', kernel2['name'])
    self.assertEqual('float32', kernel2['data'].dtype)
    self.assertEqual((4, 2), kernel2['data'].shape)
    self.assertTrue(np.allclose(np.ones([4, 2]), kernel2['data']))

  def testConvertMergedModelFromSimpleModel(self):
    input_tensor = keras.layers.Input((3,))
    dense1 = keras.layers.Dense(
        4, use_bias=True, kernel_initializer='ones', bias_initializer='zeros',
        name='MergedDense10')(input_tensor)
    output = keras.layers.Dense(
        2, use_bias=False,
        kernel_initializer='ones', name='MergedDense20')(dense1)
    model = keras.models.Model(inputs=[input_tensor], outputs=[output])
    h5_path = os.path.join(self._tmp_dir, 'MyModelMerged.h5')
    model.save(h5_path)
    config_json = json.loads(model.to_json(), encoding='utf8')

    # Load the saved weights as a JSON string.
    out, groups = self._converter.h5_merged_saved_model_to_tfjs_format(
        h5py.File(h5_path))
    saved_topology = out['model_config']

    # check the model topology was stored
    self.assertEqual(config_json['class_name'], saved_topology['class_name'])
    self.assertEqual(config_json['config'], saved_topology['config'])

    # Check the loaded weights.
    self.assertEqual(keras.__version__, out['keras_version'])
    self.assertEqual('tensorflow', out['backend'])
    weights1 = groups[0]
    self.assertEqual(2, len(weights1))
    kernel1 = weights1[0]
    self.assertEqual('MergedDense10/kernel', kernel1['name'])
    self.assertEqual('float32', kernel1['data'].dtype)
    self.assertEqual((3, 4), kernel1['data'].shape)
    self.assertTrue(np.allclose(np.ones([3, 4]), kernel1['data']))
    bias1 = weights1[1]
    self.assertEqual('MergedDense10/bias', bias1['name'])
    self.assertEqual('float32', bias1['data'].dtype)
    self.assertEqual((4,), bias1['data'].shape)
    self.assertTrue(np.allclose(np.zeros([4]), bias1['data']))
    weights2 = groups[1]
    self.assertEqual(1, len(weights2))
    kernel2 = weights2[0]
    self.assertEqual('MergedDense20/kernel', kernel2['name'])
    self.assertEqual('float32', kernel2['data'].dtype)
    self.assertEqual((4, 2), kernel2['data'].shape)
    self.assertTrue(np.allclose(np.ones([4, 2]), kernel2['data']))

  def testConvertWeightsFromSequentialModel(self):
    sequential_model = keras.models.Sequential([
        keras.layers.Dense(
            3, input_shape=(2,), use_bias=True, kernel_initializer='ones',
            name='Dense10'),
        keras.layers.Dense(
            1, use_bias=False, kernel_initializer='ones', name='Dense20')])
    h5_path = os.path.join(self._tmp_dir, 'SequentialModel.h5')
    sequential_model.save_weights(h5_path)

    # Load the saved weights as a JSON string.
    groups = self._converter.h5_weights_to_tfjs_format(h5py.File(h5_path))

    # Check the loaded weights.
    weights1 = groups[0]
    self.assertEqual(2, len(weights1))
    kernel1 = weights1[0]
    self.assertEqual('Dense10/kernel', kernel1['name'])
    self.assertEqual('float32', kernel1['data'].dtype)
    self.assertEqual((2, 3), kernel1['data'].shape)
    self.assertTrue(np.allclose(np.ones([2, 3]).tolist(), kernel1['data']))
    bias1 = weights1[1]
    self.assertEqual('Dense10/bias', bias1['name'])
    self.assertEqual('float32', bias1['data'].dtype)
    self.assertEqual((3,), bias1['data'].shape)
    self.assertTrue(np.allclose(np.zeros([3]).tolist(), bias1['data']))
    weights2 = groups[1]
    self.assertEqual(1, len(weights2))
    kernel2 = weights2[0]
    self.assertEqual('Dense20/kernel', kernel2['name'])
    self.assertEqual('float32', kernel2['data'].dtype)
    self.assertEqual((3, 1), kernel2['data'].shape)
    self.assertTrue(np.allclose(np.ones([3, 1]).tolist(), kernel2['data']))

  def testSaveModelSucceedsForNonSequentialModel(self):
    t_input = keras.Input([2])
    dense_layer = keras.layers.Dense(3)
    t_output = dense_layer(t_input)
    model = keras.Model(t_input, t_output)
    keras_h5_conversion.save_keras_model(model, self._tmp_dir)

    # Verify the content of the artifacts output directory.
    self.assertTrue(
        os.path.isfile(os.path.join(self._tmp_dir, 'group1-shard1of1')))
    model_json = json.load(
        open(os.path.join(self._tmp_dir, 'model.json'), 'rt'))

    topology_json = model_json['modelTopology']
    self.assertIn('keras_version', topology_json)
    self.assertIn('backend', topology_json)
    self.assertIn('model_config', topology_json)

    weights_manifest = model_json['weightsManifest']
    self.assertTrue(isinstance(weights_manifest, list))
    self.assertEqual(1, len(weights_manifest))
    self.assertIn('paths', weights_manifest[0])

  def testSavedModelSucceedsForExistingDirAndSequential(self):
    artifacts_dir = os.path.join(self._tmp_dir, 'artifacts')
    os.makedirs(artifacts_dir)
    model = keras.Sequential()
    model.add(keras.layers.Dense(3, input_shape=[2]))
    keras_h5_conversion.save_keras_model(model, artifacts_dir)

    # Verify the content of the artifacts output directory.
    self.assertTrue(
        os.path.isfile(os.path.join(artifacts_dir, 'group1-shard1of1')))
    model_json = json.load(
        open(os.path.join(artifacts_dir, 'model.json'), 'rt'))

    topology_json = model_json['modelTopology']
    self.assertIn('keras_version', topology_json)
    self.assertIn('backend', topology_json)
    self.assertIn('model_config', topology_json)

    weights_manifest = model_json['weightsManifest']
    self.assertTrue(isinstance(weights_manifest, list))
    self.assertEqual(1, len(weights_manifest))
    self.assertIn('paths', weights_manifest[0])

  def testSavedModelRaisesErrorIfArtifactsDirExistsAsAFile(self):
    artifacts_dir = os.path.join(self._tmp_dir, 'artifacts')
    with open(artifacts_dir, 'wt') as f:
      f.write('foo\n')
    t_input = keras.Input([2])
    dense_layer = keras.layers.Dense(3)
    t_output = dense_layer(t_input)
    model = keras.Model(t_input, t_output)
    with self.assertRaisesRegexp(ValueError, r'already exists as a file'):
      keras_h5_conversion.save_keras_model(model, artifacts_dir)


if __name__ == '__main__':
  unittest.main()
