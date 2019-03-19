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

import {InferenceModel, io, ModelPredictConfig, NamedTensorMap, Tensor} from '@tensorflow/tfjs-core';

import {tensorflow} from '../data/compiled_api';
import {NamedTensorsMap, TensorInfo} from '../data/types';
import {OperationMapper} from '../operations/operation_mapper';

import {GraphExecutor} from './graph_executor';

export const TFHUB_SEARCH_PARAM = '?tfjs-format=file';
export const DEFAULT_MODEL_NAME = 'model.json';

/**
 * A `tf.GraphModel` is a directed, acyclic graph of built from
 * SavedModel GraphDef and allows inference exeuction.
 *
 * A `tf.GraphModel` can only be created by loading from a model converted from
 * a [TensorFlow SavedModel](https://www.tensorflow.org/guide/saved_model) using
 * the command line converter tool and loaded via `tf.loadGraphModel`.
 */
/** @doc {heading: 'Models', subheading: 'Classes'} */
export class GraphModel implements InferenceModel {
  private executor: GraphExecutor;
  private version = 'n/a';
  private handler: io.IOHandler;
  // Returns the version information for the tensorflow model GraphDef.
  get modelVersion(): string {
    return this.version;
  }

  get inputNodes(): string[] {
    return this.executor.inputNodes;
  }

  get outputNodes(): string[] {
    return this.executor.outputNodes;
  }

  get inputs(): TensorInfo[] {
    return this.executor.inputs;
  }

  get outputs(): TensorInfo[] {
    return this.executor.outputs;
  }

  get weights(): NamedTensorsMap {
    return this.executor.weightMap;
  }

  /**
   * @param modelUrl url for the model, or an `io.IOHandler`.
   * @param weightManifestUrl url for the weight file generated by
   * scripts/convert.py script.
   * @param requestOption options for Request, which allows to send credentials
   * and custom headers.
   * @param onProgress Optional, progress callback function, fired periodically
   * before the load is completed.
   */
  constructor(
      private modelUrl: string|io.IOHandler,
      private loadOptions: io.LoadOptions = {}) {
    if (loadOptions == null) {
      this.loadOptions = {};
    }
  }

  private findIOHandler() {
    const path = this.modelUrl;
    if ((path as io.IOHandler).load != null) {
      // Path is an IO Handler.
      this.handler = path as io.IOHandler;
    } else if (this.loadOptions.requestInit != null) {
      this.handler = io.browserHTTPRequest(path as string, this.loadOptions);
    } else {
      const handlers =
          io.getLoadHandlers(path as string, this.loadOptions.onProgress);
      if (handlers.length === 0) {
        // For backward compatibility: if no load handler can be found,
        // assume it is a relative http path.
        handlers.push(io.browserHTTPRequest(path as string, this.loadOptions));
      } else if (handlers.length > 1) {
        throw new Error(
            `Found more than one (${handlers.length}) load handlers for ` +
            `URL '${[path]}'`);
      }
      this.handler = handlers[0];
    }
  }

  /**
   * Loads the model and weight files, construct the in memory weight map and
   * compile the inference graph.
   */
  async load(): Promise<boolean> {
    this.findIOHandler();
    if (this.handler.load == null) {
      throw new Error(
          'Cannot proceed with model loading because the IOHandler provided ' +
          'does not have the `load` method implemented.');
    }
    const artifacts = await this.handler.load();
    const graph = artifacts.modelTopology as tensorflow.IGraphDef;

    this.version = `${graph.versions.producer}.${graph.versions.minConsumer}`;
    const weightMap =
        io.decodeWeights(artifacts.weightData, artifacts.weightSpecs);
    this.executor =
        new GraphExecutor(OperationMapper.Instance.transformGraph(graph));
    this.executor.weightMap = this.convertTensorMapToTensorsMap(weightMap);
    return true;
  }

  /**
   * Execute the inference for the input tensors.
   *
   * @param input The input tensors, when there is single input for the model,
   * inputs param should be a `tf.Tensor`. For models with mutliple inputs,
   * inputs params should be in either `tf.Tensor`[] if the input order is
   * fixed, or otherwise NamedTensorMap format.
   *
   * For model with multiple inputs, we recommend you use NamedTensorMap as the
   * input type, if you use `tf.Tensor`[], the order of the array needs to
   * follow the
   * order of inputNodes array. @see {@link GraphModel.inputNodes}
   *
   * You can also feed any intermediate nodes using the NamedTensorMap as the
   * input type. For example, given the graph
   *    InputNode => Intermediate => OutputNode,
   * you can execute the subgraph Intermediate => OutputNode by calling
   *    model.execute('IntermediateNode' : tf.tensor(...));
   *
   * This is useful for models that uses tf.dynamic_rnn, where the intermediate
   * state needs to be fed manually.
   *
   * For batch inference execution, the tensors for each input need to be
   * concatenated together. For example with mobilenet, the required input shape
   * is [1, 244, 244, 3], which represents the [batch, height, width, channel].
   * If we are provide a batched data of 100 images, the input tensor should be
   * in the shape of [100, 244, 244, 3].
   *
   * @param config Prediction configuration for specifying the batch size and
   * output node names. Currently the batch size option is ignored for graph
   * model.
   *
   * @returns Inference result tensors. The output would be single `tf.Tensor`
   * if model has single output node, otherwise Tensor[] or NamedTensorMap[]
   * will be returned for model with multiple outputs.
   */
  /** @doc {heading: 'Models', subheading: 'Classes'} */
  predict(inputs: Tensor|Tensor[]|NamedTensorMap, config?: ModelPredictConfig):
      Tensor|Tensor[]|NamedTensorMap {
    return this.execute_(inputs, true, this.outputNodes);
  }

  private constructTensorMap(inputs: Tensor|Tensor[]) {
    const inputArray = inputs instanceof Tensor ? [inputs] : inputs;
    if (inputArray.length !== this.inputNodes.length) {
      throw new Error(
          'Input tensor count mismatch,' +
          `the graph model has ${this.inputNodes.length} placeholders, ` +
          `while there are ${inputArray.length} input tensors.`);
    }
    return this.inputNodes.reduce((map, inputName, i) => {
      map[inputName] = inputArray[i];
      return map;
    }, {} as NamedTensorMap);
  }
  /**
   * Executes inference for the model for given input tensors.
   * @param inputs tensor, tensor array or tensor map of the inputs for the
   * model, keyed by the input node names.
   * @param outputs output node name from the Tensorflow model, if no
   * outputs are specified, the default outputs of the model would be used.
   * You can inspect intermediate nodes of the model by adding them to the
   * outputs array.
   *
   * @returns A single tensor if provided with a single output or no outputs
   * are provided and there is only one default output, otherwise return a
   * tensor array. The order of the tensor array is the same as the outputs
   * if provided, otherwise the order of outputNodes attribute of the model.
   */
  /** @doc {heading: 'Models', subheading: 'Classes'} */
  execute(inputs: Tensor|Tensor[]|NamedTensorMap, outputs?: string|string[]):
      Tensor|Tensor[] {
    return this.execute_(inputs, false, outputs);
  }

  private execute_(
      inputs: Tensor|Tensor[]|NamedTensorMap, strictInputCheck = true,
      outputs?: string|string[]): Tensor|Tensor[] {
    outputs = outputs || this.outputNodes;
    if (inputs instanceof Tensor || Array.isArray(inputs)) {
      inputs = this.constructTensorMap(inputs);
    }
    if (this.executor.isControlFlowModel || this.executor.isDynamicShapeModel) {
      throw new Error(
          'The model contains control flow or dynamic shape ops, ' +
          'please use executeAsync method');
    }
    const result = this.executor.execute(
        this.convertTensorMapToTensorsMap(inputs), strictInputCheck, outputs);
    const keys = Object.keys(result);
    return (Array.isArray(outputs) && outputs.length > 1) ?
        outputs.map(node => result[node]) :
        result[keys[0]];
  }
  /**
   * Executes inference for the model for given input tensors in async
   * fashion, use this method when your model contains control flow ops.
   * @param inputs tensor, tensor array or tensor map of the inputs for the
   * model, keyed by the input node names.
   * @param outputs output node name from the Tensorflow model, if no outputs
   * are specified, the default outputs of the model would be used. You can
   * inspect intermediate nodes of the model by adding them to the outputs
   * array.
   *
   * @returns A Promise of single tensor if provided with a single output or
   * no outputs are provided and there is only one default output, otherwise
   * return a tensor map.
   */
  /** @doc {heading: 'Models', subheading: 'Classes'} */
  async executeAsync(
      inputs: Tensor|Tensor[]|NamedTensorMap,
      outputs?: string|string[]): Promise<Tensor|Tensor[]> {
    if (!(this.executor.isControlFlowModel ||
          this.executor.isDynamicShapeModel)) {
      throw new Error(
          'The model does not contain control flow or dynamic shape ops, ' +
          'please use execute method for better performance.');
    }
    outputs = outputs || this.outputNodes;
    if (inputs instanceof Tensor || Array.isArray(inputs)) {
      inputs = this.constructTensorMap(inputs);
    }

    const result = await this.executor.executeAsync(
        this.convertTensorMapToTensorsMap(inputs), outputs);
    const keys = Object.keys(result);
    return Array.isArray(outputs) && outputs.length > 1 ?
        outputs.map(node => result[node]) :
        result[keys[0]];
  }

  private convertTensorMapToTensorsMap(map: NamedTensorMap): NamedTensorsMap {
    return Object.keys(map).reduce((newMap: NamedTensorsMap, key) => {
      newMap[key] = [map[key]];
      return newMap;
    }, {});
  }

  /**
   * Releases the memory used by the weight tensors.
   */
  /** @doc {heading: 'Models', subheading: 'Classes'} */
  dispose() {
    this.executor.dispose();
  }
}

/**
 * Load a graph model given a URL to the model definition.
 *
 * Example of loading MobileNetV2 from a URL and making a prediction with a
 * zeros input:
 *
 * ```js
 * const modelUrl =
 *    'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json';
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
export async function loadGraphModel(
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

  const originModelUrl = modelUrl;
  if (options.fromTFHub) {
    if ((modelUrl as io.IOHandler).load == null) {
      if (!(modelUrl as string).endsWith('/')) {
        modelUrl = (modelUrl as string) + '/';
      }
      modelUrl = `${modelUrl}${DEFAULT_MODEL_NAME}${TFHUB_SEARCH_PARAM}`;
    }
  }
  const model = new GraphModel(modelUrl, options);
  try {
    await model.load();
    return model;
  } catch (error) {
    // TFHub model that is not converted will return 404 error.
    if (options.fromTFHub && error &&
        error.message.indexOf('status code 404') !== -1) {
      throw new Error(
          `TFHub model at ${originModelUrl} has not been` +
          ' converted to TensorFlow.js yet.');
    }
    throw error;
  }
}
