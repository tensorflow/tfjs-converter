/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node-gpu');

const fs = require('fs');
const jpeg = require('jpeg-js');
const simple_timer = require('node-simple-timer');
const fetch = require('node-fetch');

global.fetch = fetch;

const NUMBER_OF_CHANNELS = 3
const GOOGLE_CLOUD_STORAGE_DIR =
    'https://storage.googleapis.com/tfjs-models/savedmodel/';
const MODEL_FILE_URL = 'mobilenet_v1_1.0_224/optimized_model.pb';
const WEIGHT_MANIFEST_FILE_URL = 'mobilenet_v1_1.0_224/weights_manifest.json';
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'MobilenetV1/Predictions/Reshape_1';
const PREPROCESS_DIVISOR = tf.scalar(255 / 2);

// based on implementation from
// http://jamesthom.as/blog/2018/08/07/machine-learning-in-node-dot-js-with-tensorflow-dot-js/
const readImage =
    path => {
      const buf = fs.readFileSync(path);
      const pixels = jpeg.decode(buf, true);
      return pixels;
    }

const imageByteArray =
    (image, numChannels) => {
      const pixels = image.data;
      const numPixels = image.width * image.height;
      const values = new Int32Array(numPixels * numChannels);

      for (let i = 0; i < numPixels; i++) {
        for (let channel = 0; channel < numChannels; ++channel) {
          values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
      }

      return values;
    }

const imageToInput =
    (image, numChannels) => {
      const values = imageByteArray(image, numChannels);
      const outShape = [1, image.height, image.width, numChannels];
      const input = tf.tensor4d(values, outShape, 'float32');
      return tf.div(tf.sub(input, PREPROCESS_DIVISOR), PREPROCESS_DIVISOR);
    }

const loadModel =
    async () => {
  return await tf.loadFrozenModel(
      GOOGLE_CLOUD_STORAGE_DIR + MODEL_FILE_URL,
      GOOGLE_CLOUD_STORAGE_DIR + WEIGHT_MANIFEST_FILE_URL);
}

const benchmark =
    async (path) => {
  const image = readImage(path);
  const input = imageToInput(image, NUMBER_OF_CHANNELS);

  const mn_model = await loadModel();
  const timer = new simple_timer.Timer();
  timer.start();
  const predictions = await mn_model.predict(input).dataSync();
  timer.end();
  console.log(timer.milliseconds());

  let timers = 0;
  for (let i = 0; i < 20; i++) {
    timer.start();
    result = await mn_model.predict(input).dataSync();
    timer.end();
    timers += timer.milliseconds();
  }
  console.log(timers / 20);
}

if (process.argv.length !== 3) throw new Error(
    'incorrect arguments: node mobilenet_node.js <IMAGE_FILE>');

benchmark(process.argv[2]);
