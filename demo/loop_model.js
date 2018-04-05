/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import * as tfc from '@tensorflow/tfjs-core';
import {NamedTensorMap, loadFrozenModel} from '@tensorflow/tfjs-converter';
import {IMAGENET_CLASSES} from './imagenet_classes';
const GOOGLE_CLOUD_STORAGE_DIR =
    'https://storage.googleapis.com/tfjs-models/savedmodel/';
const MODEL_FILE_URL = 'control_flow/tensorflowjs_model.pb';
const WEIGHT_MANIFEST_FILE_URL = 'control_flow/weights_manifest.json';
const OUTPUT_NODE_NAME = 'while/Exit_3';

export class LoopModel {
  constructor() {}

  async load() {
    this.model = await loadFrozenModel(
      GOOGLE_CLOUD_STORAGE_DIR + MODEL_FILE_URL,
      GOOGLE_CLOUD_STORAGE_DIR + WEIGHT_MANIFEST_FILE_URL);
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }

  predict(init, loops, inc) {
    const dict = {'init': tfc.scalar(init), 'times': tfc.scalar(loops), 'inc': tfc.scalar(inc)};
    return this.model.execute(dict, OUTPUT_NODE_NAME);
  }
}

window.onload = async () => {
  const resultElement = document.getElementById('result');

  resultElement.innerText = 'Loading Control Flow model...';

  const loopModel = new LoopModel();
  console.time('Loading of model');
  await loopModel.load();
  console.timeEnd('Loading of model');

  const runBtn = document.getElementById('run');
  runBtn.onclick = () => {
    const init = document.getElementById('init').value;
    const loop = document.getElementById('loop').value;
    const inc = document.getElementById('inc').value;
    console.time('prediction');
    const result = loopModel.predict(init, loop, inc);
    console.timeEnd('prediction');

    resultElement.innerText = result;
  };
};
