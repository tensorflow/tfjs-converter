# Getting Started with TensorFlow.js Converter

**TensorFlow.js converter** is an open source library for loading pretrained TensorFlow models into the browser and running inference using TensorFlow.js.

It has two main components:

* **[JavaScript API](./src/executor/tf_model.ts).** A simple one-line API for performing inference on TensorFlow.js-compatible models.
* **[convert.py](./scripts/convert.py).** A Python script that converts a TensorFlow `SavedModel` to a TensorFlow.js model.

## TensorFlow.js Saved Model Format

TensorFlow.js saved models are composed of three types of files:

* *web_model.pb.* Model topology file.
* *weights_manifest.json.* Manifest file that specifies the shape, type, and name of the weight tensors, as well as the files in which weight values are stored.
* *group1-shard\*of\*.* Collection of weight-value files specified in the *weights_manifest.json*.

When served, all the above files should have the same parent directory.
For example, the [MobileNet v1 model](~https://github.com/tensorflow/models/blob/master/research/slim/nets/mobilenet_v1.md~) is available for serving from the following location:

```html
https://storage.cloud.google.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/optimized_model.pb
https://storage.cloud.google.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/weights_manifest.json
https://storage.cloud.google.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/group1-shard1of5
https://storage.cloud.google.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/group1-shard2of5
https://storage.cloud.google.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/group1-shard3of5
https://storage.cloud.google.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/group1-shard4of5
https://storage.cloud.google.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/group1-shard5of5
```

## Using the JavaScript API

You can import TensorFlow.js saved models as follows:

1. Install the `tfjs-converter` npm package:

   ```bash
   yarn add @tensorflow/tfjs-converter` or `npm install @tensorflow/tfjs-converter
   ```

2. Instantiate the [`TFModel` class](./src/executor/tf_model.ts) and run inference:

    ```javascript
    import {TFModel} from 'tfjs-converter';

    const MODEL_FILE_URL = 'http://example.org/models/mobilenet/web_model.pb';
    const WEIGHT_MANIFEST_FILE_URL = 'http://example.org/models/mobilenet/weights_manifest.json';

    const model = new TFModel(MODEL_FILE_URL, WEIGHT_MANIFEST_FILE_URL);
    const cat = document.getElementById('cat');
    model.predict({input: tf.fromPixels(cat)}); // run the inference on your model.
    ```

See [the demo](./demo) for a complete set of example code for a TensorFlow.js app that uses MobileNet to
perform image classification.

## Converting a TensorFlow [SavedModel](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/saved_model/README.md) to TensorFlow.js format

### Install dependencies

1. Clone the GitHub repo:

   ```bash
   $ git clone git@github.com:tensorflow/tfjs-converter.git
   ```

2. Install `tensorflow`, `numpy`, `absl-py`, and `protobuf` packages:

   ```bash
   $ pip install tensorflow numpy absl-py protobuf
   ```

### Run the converter

The `convert.py` script takes the following options:

| Option         | Description                                                      | Default value |
|---|---|---|
|`saved_model_dir`  | Full path to the input SavedModel directory                           | |
|`output_node_names`| The names of the output nodes, comma-separated                   | |
|`output_graph`     | Full path to the output graph (.pb) file                  | |
|`saved_model_tags` | SavedModel Tags of the MetaGraphDef to load, in comma-separated string format| `serve` |

The following command converts the `MobilenetV1/Predictions/Reshape_1` node of the TensorFlow `SavedModel` 
in */tmp/mobilenet* to a TensorFlow.js model, saved at */tmp/mobilenet_tfjs/web_model.pb*:

```bash
$ cd tfjs-converter/
$ python scripts/convert.py \
    --saved_model_dir=/tmp/mobilenet/ \
    --output_node_names='MobilenetV1/Predictions/Reshape_1' \
    --output_graph=/tmp/mobilenet_tfjs/web_model.pb \
    --saved_model_tags=serve
```

### Outputs

`convert.py` generates the set of topology, manifest, and weight files described above in [TensorFlow.js Saved Model Format](#tensorflowjs-saved-model-format).

### Limitations

Currently TensorFlow.js only supports a [limited set of Tensorflow ops](./docs/supported_ops.md).
If you convert a model containing any unsupported ops, `convert.py` script will throw an error listing
the unsupported ops. 

Please [file bugs](https://github.com/tensorflow/tfjs-converter/issues) to request support for additional
ops.

## FAQ

**1. What TensorFlow models does the converter currently support?**

Image-based models (e.g., MobileNet, SqueezeNet) are the most supported. Models with control-flow ops (e.g. RNNs) are not yet supported. See [Limitations](#limitations) above for more details on supported ops.

**2. Will models with large weights work?**

While the browser supports loading 100–500MB models, the page load time, inference time, and user experience would not be great. We recommend using models that are designed for edge devices (e.g., phones). These models are usually smaller than 30MB.

**3. Will the model and weight files be cached in the browser?**

Yes, TensorFlow.js converter splits the weights into 4MB-chunk files, which enables the browser to cache them automatically. If the model architecture is less than 4MB (most models are), it will also be cached.

**4. Does TensorFlow.js converter support models with quantization?**

Not yet. We are planning to add quantization support soon.

## Development

To build **Tensorflow.js converter** from source, clone the project and prepare
the dev environment:

```bash
$ git clone https://github.com/tensorflow/tfjs-converter.git
$ cd tfjs-converter
$ yarn prep # Installs dependencies.
```

We recommend using [Visual Studio Code](https://code.visualstudio.com/) for
development. Make sure to install the
[TSLint VSCode extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
and the npm [clang-format](https://github.com/angular/clang-format) `1.2.2` or later
with the
[Clang-Format VSCode extension](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)
for auto-formatting.

Before submitting a pull request, make sure the code passes all the tests and is clean of lint errors:

```bash
$ yarn test
$ yarn lint
```
To run a subset of tests and/or on a specific browser:

```bash
$ yarn test --browsers=Chrome --grep='execute'

> ...
> Chrome 64.0.3282 (Linux 0.0.0): Executed 39 of 39 SUCCESS (0.129 secs / 0 secs)
```

To run the tests once and exit the karma process (helpful on Windows):

```bash
$ yarn test --single-run
```
