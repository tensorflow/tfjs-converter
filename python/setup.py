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
from pip._vendor import pkg_resources

def _is_correct_tensorflow_installed():
    "Checks if the current TensorFlow installation is of version at least 2.0"
    return next(
        (
            pkg.version >= '2'
            for pkg in pkg_resources.working_set
            if pkg.project_name.lower() == "tensorflow"
        ),
        True
    )

if not _is_correct_tensorflow_installed():
    raise ImportError(
      (
        "Please install TensorFlow.js in a virtual environment,"
        " or set up TensorFlow >= 2.0 manually."
      )
    )

from tensorflowjs import version


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
