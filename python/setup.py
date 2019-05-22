# Copyright 2018 Google LLC. All Rights Reserved.
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
"""Build pip wheel for model_converter."""

import os
import setuptools
from setuptools.command.install import install as InstallCommandBase
from tensorflowjs import version


class InstallCommand(InstallCommandBase):
  """Override the dir where the headers go."""

  def initialize_options(self):
    ret = InstallCommandBase.initialize_options(self)

    try:
      import tensorflow as tf
      if tf.__version__.startswith('0.') or tf.__version__.startswith('1.'):
        raise ValueError(
            '\nIt appears that you have a version of tensorflow older than '
            '2.x (%s) installed in your Python environment. '
            'Therefore we have halted the tensorflowjs installation '
            'to avoid overwriting your existing tensorflow install.\n\n'
            'Please install tensorflowjs in a clean virtualenv or pipenv, '
            'or alternatively, upgrade your tensorflow install to 2.x before '
            'installing tensorflowjs.' % (tf.__version__, version))
    except ImportError:
      pass
    return ret


DIR_NAME = os.path.dirname(__file__)


def _get_requirements(file):
    "Reads the requirements file and returns the packages"
    with open(os.path.join(DIR_NAME, file), 'r') as requirements:
        return requirements.readlines()

CONSOLE_SCRIPTS = [
    'tensorflowjs_converter = tensorflowjs.converters.converter:main',
]

setuptools.setup(
    name='tensorflowjs',
    version=version.version,
    description='Python Libraries and Tools for TensorFlow.js',
    url='https://js.tensorflow.org/',
    author='Google LLC',
    author_email='opensource@google.com',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Intended Audience :: Education',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: JavaScript',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 3',
        'Topic :: Scientific/Engineering',
        'Topic :: Scientific/Engineering :: Mathematics',
        'Topic :: Scientific/Engineering :: Artificial Intelligence',
        'Topic :: Software Development',
        'Topic :: Software Development :: Libraries',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
    cmdclass={
        'install': InstallCommand,
    },
    py_modules=[
        'tensorflowjs',
        'tensorflowjs.version',
        'tensorflowjs.quantization',
        'tensorflowjs.read_weights',
        'tensorflowjs.write_weights',
        'tensorflowjs.converters',
        'tensorflowjs.converters.common',
        'tensorflowjs.converters.converter',
        'tensorflowjs.converters.keras_h5_conversion',
        'tensorflowjs.converters.keras_tfjs_loader',
        'tensorflowjs.converters.tf_saved_model_conversion_v2',
    ],
    include_package_data=True,
    packages=['tensorflowjs/op_list'],
    package_data={
        'tensorflowjs/op_list': ['*.json']
    },
    install_requires=_get_requirements('requirements.txt'),
    entry_points={
        'console_scripts': CONSOLE_SCRIPTS,
    },
    license='Apache 2.0',
    keywords='tensorflow javascript machine deep learning converter',
)
