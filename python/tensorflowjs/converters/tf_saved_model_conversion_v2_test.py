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
"""Unit tests for artifact conversion to and from Tensorflow SavedModel."""

import glob
import json
import os
import shutil
import tempfile
import unittest

import tensorflow as tf
from tensorflow.python.grappler import tf_optimizer
from tensorflow.python.eager import def_function
from tensorflow.python.framework import constant_op
from tensorflow.python.ops import variables
from tensorflow.python.saved_model.load import load
from tensorflow.python.training.tracking import tracking
from python.saved_model.save import save
from tensorflowjs.converters import tf_saved_model_conversion_v2

SAVED_MODEL_DIR = 'saved_model'


class ConvertTest(unittest.TestCase):
  def setUp(self):
    super(ConvertTest, self).setUp()
    self._tmp_dir = tempfile.mkdtemp()

  def tearDown(self):
    if os.path.isdir(self._tmp_dir):
      shutil.rmtree(self._tmp_dir)
    super(ConvertTest, self).tearDown()

  def create_saved_model(self):
    """Test a basic model with functions to make sure functions are inlined."""
    input_data = constant_op.constant(1., shape=[1])
    root = tracking.AutoTrackable()
    root.v1 = variables.Variable(3.)
    root.v2 = variables.Variable(2.)
    root.f = def_function.function(lambda x: root.v1 * root.v2 * x)
    to_save = root.f.get_concrete_function(input_data)

    save_dir = os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    save(root, save_dir, to_save)

  def test_convert_saved_model(self):
    self.create_saved_model()
    print(glob.glob(
        os.path.join(self._tmp_dir, SAVED_MODEL_DIR, '*')))

    tf_saved_model_conversion_v2.convert_tf_saved_model(
        os.path.join(self._tmp_dir, SAVED_MODEL_DIR),
        os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    )

    weights = [{
        'paths': ['group1-shard1of1.bin'],
        'weights': [{
            'shape': [2, 2],
            'name': 'Softmax',
            'dtype': 'float32'
        }]
    }]

    tfjs_path = os.path.join(self._tmp_dir, SAVED_MODEL_DIR)
    # Check model.json and weights manifest.
    with open(os.path.join(tfjs_path, 'model.json'), 'rt') as f:
      model_json = json.load(f)
    self.assertTrue(model_json['modelTopology'])
    weights_manifest = model_json['weightsManifest']
    self.assertEqual(weights_manifest, weights)

    self.assertTrue(
        glob.glob(
            os.path.join(self._tmp_dir, SAVED_MODEL_DIR, 'group*-*')))

if __name__ == '__main__':
  unittest.main()
