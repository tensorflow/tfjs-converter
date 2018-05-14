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
import {tensorflow} from '../data';

const PATH_SEPARATOR = '/';
const MODEL_TOPOLOGY_SUFFIX = 'web_model.pb';
const WEIGHT_SPECS_SUFFIX = 'weights_manifest.json';

/**
 * IOHandler subclass: Url Storage.
 *
 * See the doc string to `urlStorage` for more details.
 */
export class UrlStorage implements io.IOHandler {
  protected readonly modelUrlPath: string;
  protected readonly paths: {[key: string]: string};

  constructor(modelUrlPath: string, private requestOptions: RequestInit) {
    if (!modelUrlPath) {
      throw new Error(
          'For local storage, modelPath must not be null, undefined or empty.');
    }
    this.modelUrlPath = modelUrlPath;
    this.paths = {
      topology: [modelUrlPath, MODEL_TOPOLOGY_SUFFIX].join(PATH_SEPARATOR),
      weightSpecs: [modelUrlPath, WEIGHT_SPECS_SUFFIX].join(PATH_SEPARATOR),
    };
  }

  /**
   * Save model artifacts to url.
   *
   * @param modelArtifacts The model artifacts to be stored.
   * @returns An instance of SaveResult.
   */
  async save(modelArtifacts: io.ModelArtifacts): Promise<io.SaveResult> {
    throw new Error('Frozen model does not support saving model.');
  }

  /**
   * Loads the model topology file and build the in memory graph of the model.
   */
  private async loadRemoteProtoFile(): Promise<tensorflow.GraphDef> {
    try {
      const response = await fetch(this.paths.topology, this.requestOptions);
      return tensorflow.GraphDef.decode(
          new Uint8Array(await response.arrayBuffer()));
    } catch (error) {
      throw new Error(`${this.paths.topology} not found. ${error}`);
    }
  }

  /**
   * Loads and parses the weight manifest JSON file from the url, weight loader
   * uses the manifest config to download the set of weight files.
   */
  private async loadWeightManifest(): Promise<io.WeightsManifestConfig> {
    try {
      const manifest = await fetch(this.paths.manifest, this.requestOptions);
      return manifest.clone().json();
    } catch (error) {
      throw new Error(`${this.paths.manifest} not found. ${error}`);
    }
  }

  /**
   * Load a model from local storage.
   *
   * See the documentation to `browserLocalStorage` for details on the saved
   * artifacts.
   *
   * @returns The loaded model (if loading succeeds).
   */
  async load(): Promise<io.ModelArtifacts> {
    const out: io.ModelArtifacts = {};

    // Load topology.
    const topology = await this.loadRemoteProtoFile();
    out.modelTopology = topology;

    // Load weight specs.
    const weightSpecs = await this.loadWeightManifest();
    out.weightSpecs = weightSpecs.reduce((sum, spec) => {
      return sum.concat(spec.weights);
    }, []);

    // out.weightData = await io.loadWeights(
    //     weightSpecs, this.modelUrlPath, undefined, this.requestOptions);

    return out;
  }
}

/**
 * Factory function for url IOHandler.
 *
 * This `IOHandler` supports both `save` and `load`.
 *
 * For each model's saved artifacts, four items are saved to local storage.
 *   - `${PATH_SEPARATOR}/${modelPath}/info`: Contains meta-info about the
 *     model, such as date saved, type of the topology, size in bytes, etc.
 *   - `${PATH_SEPARATOR}/${modelPath}/topology`: Model topology. For Keras-
 *     style models, this is a stringized JSON.
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_specs`: Weight specs of the
 *     model, can be used to decode the saved binary weight values (see
 *     item below).
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_data`: Concatenated binary
 *     weight values, stored as a base64-encoded string.
 *
 * Saving may throw an `Error` if the total size of the artifacts exceed the
 * browser-specific quota.
 *
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `BrowserLocalStorage` (sublcass of `IOHandler`),
 *   which can be used with, e.g., `tf.Model.save`.
 */
export function urlStorage(modelPath: string, requestOptions?: RequestInit) {
  return new UrlStorage(modelPath, requestOptions);
}
