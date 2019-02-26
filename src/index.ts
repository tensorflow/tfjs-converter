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
import {io} from '@tensorflow/tfjs-core';

import {FrozenModel as GraphModel, loadFrozenModel, loadTfHubModule} from './executor/frozen_model';

export {FrozenModel as GraphModel} from './executor/frozen_model';
export {version as version_converter} from './version';


/**
 * Load a graph model given a URL to the model definition.
 *
 * Example of loading MobileNetV2 from a URL and making a prediction with a
 * zeros input:
 *
 * ```js
 * const modelUrl =
 *    'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/tensorflowjs_model.pb';
 * const model = await tf.loadGraphModel(modelUrl);
 * const zeros = tf.zeros([1, 224, 224, 3]);
 * model.predict(zeros).print();
 * ```
 *
 * Example of loading MobileNetV2 from a TF Hub URL and making a prediction with
 * a zeros input:
 *
 * ```js
 * const modelUrl =
 *    'https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/2';
 * const model = await tf.loadGraphModel(modelUrl, {fromTFHub: true});
 * const zeros = tf.zeros([1, 224, 224, 3]);
 * model.predict(zeros).print();
 * ```
 * @param modelUrl The url or an `io.IOHandler` that loads the model.
 * @param options Options for the HTTP request, which allows to send credentials
 *    and custom headers.
 */
/** @doc {heading: 'Models', subheading: 'Loading'} */
export function loadGraphModel(
    modelUrl: string|io.IOHandler,
    options: io.LoadOptions = {}): Promise<GraphModel> {
  if (modelUrl == null) {
    throw new Error(
        'modelUrl in loadGraphModel() cannot be null. Please provide a url ' +
        'or an IOHandler that loads the model');
  }
  if (options == null) {
    options = {};
  }

  if (options.fromTFHub) {
    return loadTfHubModule(
        modelUrl as string, options.requestInit, options.onProgress);
  }

  return loadFrozenModel(modelUrl, options.requestInit, options.onProgress);
}
