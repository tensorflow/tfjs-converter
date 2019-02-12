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

import {DEFAULT_MANIFEST_NAME, FrozenModel, FrozenModel as GraphModel, loadFrozenModel as loadFrozenModelPB} from './executor/frozen_model';
import {loadFrozenModel as loadFrozenModelJSON} from './executor/frozen_model_json';

export {FrozenModel, loadTfHubModule} from './executor/frozen_model';
export {FrozenModel as GraphModel} from './executor/frozen_model';
export {FrozenModel as FrozenModelJSON} from './executor/frozen_model_json';
export {version as version_converter} from './version';

export function loadFrozenModel(
    modelUrl: string, weightsManifestUrl?: string, requestOption?: RequestInit,
    onProgress?: Function): Promise<FrozenModel> {
  if (modelUrl && modelUrl.endsWith('.json')) {
    return (loadFrozenModelJSON(modelUrl, requestOption, onProgress) as
                // tslint:disable-next-line:no-any
                Promise<any>) as Promise<FrozenModel>;
  }
  // if user are using the new loadGraphModel API, the weightManifestUrl will be
  // omitted, we will build the url using the model url path and default
  // manifest file name.
  if (modelUrl != null && weightsManifestUrl == null) {
    const path = modelUrl.substr(0, modelUrl.lastIndexOf('/'));
    weightsManifestUrl = path + '/' + DEFAULT_MANIFEST_NAME;
  }
  return loadFrozenModelPB(
      modelUrl, weightsManifestUrl, requestOption, onProgress);
}

export function loadGraphModel(
    modelUrl: string, options: io.LoadOptions): Promise<GraphModel> {
  return loadFrozenModel(
      modelUrl, undefined, options.requestInit, options.onProgress);
}
