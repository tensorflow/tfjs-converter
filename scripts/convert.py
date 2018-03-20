"""Convert Tensorflow SavedModel to TensorFlow.js web format.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import sys
import os
import json
import numpy as np
import tensorflow as tf

from absl import flags

from tensorflow.core.protobuf import device_properties_pb2, rewriter_config_pb2
from tensorflow.python.grappler import cluster as gcluster
from tensorflow.python.grappler import tf_optimizer
from tensorflow.python.lib.io import file_io
from tensorflow.python.tools import freeze_graph

from google.protobuf import text_format

sys.path.append(
    os.path.join(
        os.path.dirname(__file__), '..',
        'node_modules/deeplearn-src/scripts/'))
import write_weights as tfc

flags.DEFINE_string('saved_model_dir', '', 'The saved model directory.')
flags.DEFINE_string('output_node_names', '',
                    'The names of the output nodes, comma separated.')
flags.DEFINE_string('output_graph', '', 'The name of the output graph file')
flags.DEFINE_string(
    'saved_model_tags', 'serve',
    'Tags of the MetaGraphDef to load, in comma separated string format.')

FLAGS = flags.FLAGS


def get_cluster():
    """ Grappler optimization configuration for GPU."""
    named_device = device_properties_pb2.NamedDevice()
    named_device.name = '/GPU:0'
    named_device.properties.type = 'GPU'
    named_device.properties.environment['architecture'] = '4'
    cluster = gcluster.Cluster(devices=[named_device])
    return cluster


def load_graph(graph_filename):
    """Loads GraphDef. Returns Python Graph object.

    Args:
      graph_filename: string file name for the frozen graph
    """
    with tf.gfile.Open(graph_filename, 'rb') as file:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(file.read())

    with tf.Graph().as_default() as graph:
        # Set name to empty to avoid using the default name 'import'.
        tf.import_graph_def(graph_def, name='')

    for node in FLAGS.output_node_names.split(','):
        graph.add_to_collection('train_op',
                                graph.get_operation_by_name(node.strip()))

    return graph

def validate(nodes):
    """Validate if the node's op is compatible with TensorFlow.js.

    Args:
      nodes: tf.NodeDef tensorflow NodeDef objects from GraphDef
    """
    ops = []
    op_list_path = 'src/operations/op_list/'
    dir_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    for filename in os.listdir(os.path.join(dir_path, op_list_path)):
        with open(os.path.join(dir_path, op_list_path, filename)) as json_data:
            ops += json.load(json_data)

    names = set([x['tfOpName'] for x in ops])
    not_supported = set(
        [x.op for x in [x for x in nodes if (x.op not in names)]])
    return not_supported


def optimize_graph(graph):
    """Takes a Python Graph object and optimizes the graph.

    Args:
      graph: tf.Graph tensorflow dataflow graph
    """
    rewriter_config = rewriter_config_pb2.RewriterConfig()
    rewriter_config.optimizers[:] = [
        'pruning', 'constfold', 'arithmetic', 'dependency', 'pruning',
        'constfold', 'arithmetic', 'dependency'
    ]
    meta_graph = tf.train.export_meta_graph(
        graph_def=graph.as_graph_def(), graph=graph)
    optimized_graph = tf_optimizer.OptimizeGraph(
        rewriter_config, meta_graph, cluster=get_cluster())

    extract_weights(graph, optimized_graph)
    return optimize_graph


def extract_weights(graph, graph_def):
    """Takes a Python GraphDef object and extract the weights.

    Args:
      graph: tf.Graph tensorflow dataflow graph
      graph_def: tf.GraphDef tensorflow GraphDef proto object, which represents
        the model topology
    """
    constants = [node for node in graph_def.node if node.op == 'Const']
    print('Writing weight file ' + FLAGS.output_graph + '...')
    const_manifest = []
    path = os.path.dirname(FLAGS.output_graph)

    with tf.Session(graph=graph) as sess:
        for const in constants:
            tensor = graph.get_tensor_by_name(const.name + ':0')
            value = tensor.eval(session=sess)
            if not isinstance(value, np.ndarray):
                value = np.array(value)

            const_manifest.append({'name': const.name, 'data': value})

            # Remove the binary array from tensor and save it to the external file.
            const.attr["value"].tensor.ClearField('tensor_content')

    tfc.write_weights([const_manifest], path)

    file_io.atomic_write_string_to_file(
        os.path.abspath(FLAGS.output_graph), graph_def.SerializeToString())

    file_io.atomic_write_string_to_file(
        os.path.abspath(FLAGS.output_graph + 'txt'),
        text_format.MessageToString(graph_def))


def convert(output_node_names, output_graph, saved_model_tags,
            saved_model_dir):
    """Freeze the SavedModel and check the model compatibility with Tensorflow.js.
    Optimize and convert the model to Tensorflow.js format, when the model passes
    the compatiblity check.

    Args
      output_node_names: string The names of the output nodes, comma separated.
      output_graph: string The name of the output graph file.
      saved_model_tags: string Tagset of the MetaGraphDef to load, in comma separated string format.
      saved_model_dir: string The saved model directory.

    """
    freeze_graph.freeze_graph(
        '',
        '',
        True,
        '',
        output_node_names,
        '',
        '',
        output_graph + '.frozen',
        True,
        '',
        saved_model_tags=saved_model_tags,
        input_saved_model_dir= saved_model_dir)
    graph = load_graph(output_graph + '.frozen')
    unsupported = validate(graph.as_graph_def().node)
    if unsupported:
        print('Unsupported Ops in the model\n' + ', '.join(unsupported))
    else:
        optimize_graph(graph)


def main(_):
    convert(FLAGS.output_node_names, FLAGS.output_graph,
            FLAGS.saved_model_tags, FLAGS.saved_model_dir)


if __name__ == '__main__':
    FLAGS(sys.argv)
    tf.app.run(main)
