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

import unittest

import numpy as np

from tensorflowjs import quantization_util

class TestQuantizationUtil(unittest.TestCase):

  def _runQuantizeTest(
      self, range_min, range_max, data_dtype, quantization_dtype,
       allow_for_min_error=None):
    d = np.arange(range_min, range_max + 1, dtype=data_dtype)
    q, s, m = quantization_util.quantize_weights(d, quantization_dtype)
    self.assertEqual(q.dtype, quantization_dtype)

    de_q = quantization_util.dequantize_weights(q, s, m, data_dtype)
    if allow_for_min_error:
      self.assertAlmostEqual(de_q[0], d[0], delta=allow_for_min_error)
      de_q = de_q[1:]
      d = d[1:]

    np.testing.assert_allclose(de_q, d, atol=4e-2)

    d_0 = np.zeros(1, data_dtype)
    q_0 = (d_0 - m) / s
    self.assertEqual(
      quantization_util.dequantize_weights(q_0, s, m, data_dtype), d_0)

  def testQuantizeNegativeFloats(self):
    # This case is not well-covered by the nudging algorithm from TF-Lite
    # so we have to give the min value a larger error.
    self._runQuantizeTest(
        -3, -1, np.float32, np.uint8, allow_for_min_error=1.0)

  def testQuantizeNegativeAndZeroFloats(self):
    self._runQuantizeTest(-3, 0, np.float32, np.uint8)
    self._runQuantizeTest(-3, 0, np.float32, np.uint16)

  def testQuantizeNegativeAndPositiveFloats(self):
    self._runQuantizeTest(-3, 3, np.float32, np.uint8)
    self._runQuantizeTest(-3, 3, np.float32, np.uint16)

  def testQuantizeZeroAndPositiveFloats(self):
    self._runQuantizeTest(0, 3, np.float32, np.uint8)
    self._runQuantizeTest(0, 3, np.float32, np.uint16)

  def testQuantizePositiveFloats(self):
    self._runQuantizeTest(0, 3, np.float32, np.uint8)
    self._runQuantizeTest(0, 3, np.float32, np.uint16)

  def testQuantizeNegativeInts(self):
    # This case is not well-covered by the nudging algorithm from TF-Lite
    # so we have to give the min value a larger error.
    self._runQuantizeTest(-3, -1, np.int32, np.uint8, allow_for_min_error=1.0)
    self._runQuantizeTest(-3, -1, np.int32, np.uint16, allow_for_min_error=1.0)

  def testQuantizeNegativeAndZeroInts(self):
    self._runQuantizeTest(-3, 0, np.int32, np.uint8)
    self._runQuantizeTest(-3, 0, np.int32, np.uint16)

  def testQuantizeNegativeAndPositiveInts(self):
    self._runQuantizeTest(-3, 3, np.int32, np.uint8)
    self._runQuantizeTest(-3, 3, np.int32, np.uint16)

  def testQuantizeZeroAndPositiveInts(self):
    self._runQuantizeTest(0, 3, np.int32, np.uint8)
    self._runQuantizeTest(0, 3, np.int32, np.uint16)

  def testQuantizePositiveInts(self):
    self._runQuantizeTest(0, 3, np.int32, np.uint8)
    self._runQuantizeTest(0, 3, np.int32, np.uint16)


if __name__ == '__main__':
  unittest.main()
