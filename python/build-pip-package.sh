#!/usr/bin/env bash
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

# Build pip package for keras_model_converter.

set -e

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ $# != 1 ]]; then
  echo "Usage:"
  echo "  build-pip-packages.sh <OUTPUT_DIR>"
  echo
  echo "Args:"
  echo "  OUTPUT_DIR: Directory where the pip (.whl) file will be written."
  exit 1
fi
DEST_DIR="$1"

mkdir -p "${DEST_DIR}"

TMP_DIR=$(mktemp -d)
echo "Using temporary directory: ${TMP_DIR}"

pushd "${SCRIPTS_DIR}" > /dev/null
echo

# Copy all non-test .py files.
PY_FILES=$(find . -name '*.py' ! -name '*_test.py')
for PY_FILE in ${PY_FILES}; do
  echo "Copying ${PY_FILE}"
  PY_DIR=$(dirname "${PY_FILE}")
  mkdir -p "${TMP_DIR}/${PY_DIR}"
  cp "${PY_FILE}" "${TMP_DIR}/${PY_DIR}"
done

# Copy .json files under op_list
OP_LIST_DIR="tensorflowjs/op_list"
JSON_FILES=$(find -L "${SCRIPTS_DIR}/${OP_LIST_DIR}" -name '*.json')
if [[ -z "${JSON_FILES}" ]]; then
  echo "ERROR: Failed to find any .json files in ${SCRIPTS_DIR}/${OP_LIST_DIR}"
  exit 1
fi

mkdir -p "${TMP_DIR}/${OP_LIST_DIR}"
echo
for JSON_FILE in ${JSON_FILES}; do
  echo "Copying JSON file: $(basename "${JSON_FILE}")"
  cp "${JSON_FILE}" "${TMP_DIR}/${OP_LIST_DIR}"
done

# Copy README.md.
echo
echo "Copying README.md"
cp "${SCRIPTS_DIR}/README.md" "${TMP_DIR}/"

# Copy setup.cfg
echo
echo "Copying setup.cfg"
cp "${SCRIPTS_DIR}/setup.cfg" "${TMP_DIR}/"

echo
popd

pushd "${TMP_DIR}" > /dev/null

python setup.py bdist_wheel
WHEELS=$(ls dist/*.whl)
mv dist/*.whl "${DEST_DIR}/"

popd > /dev/null

echo
echo "Generated wheel file(s) in ${DEST_DIR} :"
for WHEEL in ${WHEELS}; do
  echo "  $(basename "${WHEEL}")"
done

rm -rf "${TMP_DIR}"
