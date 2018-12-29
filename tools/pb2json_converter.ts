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
import * as fs from 'fs';
import * as Long from 'long';
import * as path from 'path';

import {tensorflow} from './compiled_api';

function replacer(key: string, value: any) {
  if (value instanceof Long) {
    return (value as Long).toString();
  }
  if (value instanceof Uint8Array) {
    return Array.from(value);
  }
  return value;
}
function convert(argv: string[]) {
  if (argv.length < 4) {
    console.log(
        'Usage: ts-node pb2json.ts pb_model_directory json_model_directory');
    return;
  }

  const sourcePath = process.argv[2];
  console.log('reading pb model directory: ' + sourcePath);
  fs.readdir(sourcePath, (err, files) => {
    if (!['tensorflowjs_model.pb', 'weights_manifest.json'].every(
            file => files.indexOf(file) !== -1)) {
      console.log(
          'Please make sure the pb model directory contains ' +
          'tensorflowjs_model.pb and weights_manifest.json files');
      return;
    }

    const modelFile = path.join(sourcePath, 'tensorflowjs_model.pb');
    console.log('reading pb file: ' + modelFile);
    const buffer = fs.readFileSync(modelFile);

    const modelTopology = tensorflow.GraphDef.decode(new Uint8Array(buffer));

    const manifestFile = path.join(sourcePath, 'weights_manifest.json');
    console.log('reading manifest file: ' + manifestFile);
    const weightsManifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));

    const destPath = process.argv[3];

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
    }
    const destModelFile = path.join(destPath, 'model.json');
    console.log('writing json file: ' + destModelFile);
    fs.writeFileSync(
        destModelFile,
        JSON.stringify({modelTopology, weightsManifest}, replacer));

    files.forEach(file => {
      if (file !== 'tensorflowjs_model.pb' &&
          file !== 'weights_manifest.json') {
        fs.copyFile(
            path.join(sourcePath, file), path.join(destPath, file), (err) => {
              if (err) throw err;
              console.log(`Weight file: ${file} copied.`);
            });
      }
    });
  });
}

convert(process.argv);
