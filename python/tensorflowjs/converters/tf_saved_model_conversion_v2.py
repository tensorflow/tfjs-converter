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
"""Convert Tensorflow SavedModel to TensorFlow.js web format."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import os
import numpy as np

import tensorflow as tf
from tensorflow.python.framework import convert_to_constants
from tensorflow.core.protobuf import config_pb2
from tensorflow.python.framework import graph_util
from tensorflow.python.grappler import cluster as gcluster
from tensorflow.python.grappler import tf_optimizer
from tensorflowjs import write_weights
from tensorflowjs.converters import tf_saved_model_conversion
from tensorflow.python.saved_model.load import load

def load_graph(graph_filename, output_node_names):
  """Loads GraphDef. Returns Python Graph object.

  Args:
    graph_filename: string File name for the frozen graph.
  """
  with tf.gfile.Open(graph_filename, 'rb') as f:
    graph_def = tf.GraphDef()
    graph_def.ParseFromString(f.read())

  with tf.Graph().as_default() as graph:
    # Set name to empty to avoid using the default name 'import'.
    tf.import_graph_def(graph_def, name='')

  for node in output_node_names.split(','):
    graph.add_to_collection('train_op',
                            graph.get_operation_by_name(node.strip()))

  return graph

def optimize_graph(graph, graph_def,
                   output_graph,
                   quantization_dtype=None,
                   skip_op_check=False,
                   strip_debug_ops=False):
  """Takes a Python Graph object and optimizes the graph.

  Args:
    graph: tf.Graph TensorFlow dataflow graph.
    graph_def: tf.GraphDef TensorFlow GraphDef proto object, which represents
      the model topology.
    quantization_dtype: An optional numpy dtype to quantize weights to for
      compression. Only np.uint8 and np.uint16 are supported.
    skip_op_check: Bool whether to skip the op check.
    strip_debug_ops: Bool whether to strip debug ops.
  """
  unsupported = tf_saved_model_conversion.validate(graph.as_graph_def().node, skip_op_check,
                         strip_debug_ops)
  if unsupported:
    raise ValueError('Unsupported Ops in the model before optimization\n' +
                     ', '.join(unsupported))

  config = config_pb2.ConfigProto()
  rewriter_config = config.graph_options.rewrite_options
  rewriter_config.optimizers[:] = [
      'pruning', 'constfold', 'arithmetic', 'dependency', 'pruning', 'remap',
      'constfold', 'arithmetic', 'dependency'
  ]
  if strip_debug_ops:
    rewriter_config.optimizers.insert(0, 'debug_stripper')
  meta_graph = tf.train.export_meta_graph(
      graph_def=graph.as_graph_def(), graph=graph)
  optimized_graph = tf_optimizer.OptimizeGraph(
      config, meta_graph, cluster=tf_saved_model_conversion.get_cluster())

  unsupported = tf_saved_model_conversion.validate(optimized_graph.node, skip_op_check,
                         strip_debug_ops)

  if unsupported:
    raise ValueError('Unsupported Ops in the model after optimization\n' +
                     ', '.join(unsupported))

  tf_saved_model_conversion.extract_weights(optimized_graph, output_graph, quantization_dtype)
  return optimize_graph

def convert_tf_saved_model(saved_model_dir,
                           output_dir, signature_def='serving_default',
                           quantization_dtype=None,
                           skip_op_check=False,
                           strip_debug_ops=False):
  """Freeze the SavedModel and check the model compatibility with Tensorflow.js.

  Optimize and convert the model to Tensorflow.js format, when the model passes
  the compatiblity check.

  Args:
    saved_model_dir: string The saved model directory.
    : string The names of the output nodes, comma separated.
    output_dir: string The name of the output directory. The directory
      will consist of
      - a file named 'model.json'
      - possibly sharded binary weight files.
    signature_def: string Tagset of the SignatureDef to load. Defaulted to 'serving_default'
    quantization_dtype: An optional numpy dtype to quantize weights to for
      compression. Only np.uint8 and np.uint16 are supported.
    skip_op_check: Bool whether to skip the op check.
    strip_debug_ops: Bool whether to strip debug ops.
  """

  if not os.path.exists(output_dir):
    os.makedirs(output_dir)
  output_graph = os.path.join(output_dir, tf_saved_model_conversion.DEFAULT_MODEL_FILENAME)

  model = load(saved_model_dir)
  concrete_func = model.signatures[signature_def]
  graph_def = convert_to_constants.convert_variables_to_constants_v2(
        concrete_func)

  optimize_graph(concrete_func.graph, graph_def, output_graph, quantization_dtype=quantization_dtype,
                   skip_op_check=skip_op_check, strip_debug_ops=strip_debug_ops)
