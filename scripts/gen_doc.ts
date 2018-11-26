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

import * as arithmetic from '../src/operations/op_list/arithmetic';
import * as basicMath from '../src/operations/op_list/basic_math';
import * as control from '../src/operations/op_list/control';
import * as convolution from '../src/operations/op_list/convolution';
import * as creation from '../src/operations/op_list/creation';
import * as dynamic from '../src/operations/op_list/dynamic';
import * as evaluation from '../src/operations/op_list/evaluation';
import * as graph from '../src/operations/op_list/graph';
import * as image from '../src/operations/op_list/image';
import * as logical from '../src/operations/op_list/logical';
import * as matrices from '../src/operations/op_list/matrices';
import * as normalization from '../src/operations/op_list/normalization';
import * as reduction from '../src/operations/op_list/reduction';
import * as sliceJoin from '../src/operations/op_list/slice_join';
import * as transformation from '../src/operations/op_list/transformation';
import {OpMapper} from '../src/operations/types';

const JSON_DIR = './tfjs-core.json';
const DOC_DIR = '../docs/';

const ops = [
  arithmetic, basicMath, control, convolution, creation, dynamic, evaluation,
  logical, image, graph, matrices, normalization, reduction, sliceJoin,
  transformation
];

async function genDoc() {
  const json = JSON.parse(fs.readFileSync(JSON_DIR, 'utf8'));
  // tslint:disable-next-line:no-any
  const coreApis = json.docs.headings.reduce((list: Array<{}>, h: any) => {
    return h.subheadings ? list.concat(h.subheadings.reduce(
                               // tslint:disable-next-line:no-any
                               (sublist: Array<{}>, sub: any) => {
                                 return sublist.concat(sub.symbols);
                               },
                               [])) :
                           list;
  }, []);
  const output: string[] = [];

  output.push('# Supported Tensorflow Ops\n\n');

  generateTable(
      'Operations', 'Arithmetic', (arithmetic.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Basic math', (basicMath.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Control Flow', (control.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Convolution', (convolution.json as {}) as OpMapper[],
      output, coreApis);
  generateTable(
      'Tensors', 'Creation', (creation.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Dynamic', (dynamic.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Evaluation', (evaluation.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Tensorflow', 'Graph', (graph.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Logical', (logical.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Matrices', (matrices.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Normalization', (normalization.json as {}) as OpMapper[],
      output, coreApis);
  generateTable(
      'Operations', 'Images', (image.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Operations', 'Reduction', (reduction.json as {}) as OpMapper[], output,
      coreApis);
  generateTable(
      'Tensors', 'Slicing and Joining', (sliceJoin.json as {}) as OpMapper[],
      output, coreApis);
  generateTable('Operations', 'Spectral', [] as OpMapper[], output, coreApis);
  generateTable(
      'Tensors', 'Transformations', (transformation.json as {}) as OpMapper[],
      output, coreApis);

  console.log(process.cwd());
  fs.writeFileSync(DOC_DIR + 'supported_ops.md', output.join(''));

  console.log(
      `Supported Ops written to ${DOC_DIR + 'supported_ops.md'}\n` +
      `Found ${ops.reduce((sum, cat) => sum += cat.json.length, 0)} ops\n`);
}

function findCoreOps(heading: string, subHeading: string, coreApis: Array<{}>) {
  return coreApis.filter(
      // tslint:disable-next-line:no-any
      (op: any) => op.docInfo.heading === heading &&
          op.docInfo.subheading === subHeading);
}

function generateTable(
    heading: string, subHeading: string, ops: OpMapper[], output: string[],
    coreApis: Array<{}>) {
  const coreOps = findCoreOps(heading, subHeading, coreApis);
  output.push(`## ${heading} - ${subHeading}\n\n`);
  output.push('|Tensorflow Op Name|Tensorflow.js Op Name|\n');
  output.push('|---|---|\n');
  ops.sort((a, b) => a.tfOpName.localeCompare(b.tfOpName)).forEach(element => {
    output.push(`|${element.tfOpName}|${element.dlOpName}|\n`);
  });

  coreOps
      // tslint:disable-next-line:no-any
      .sort((a: any, b: any) => a.symbolName.localeCompare(b.symbolName))
      // tslint:disable-next-line:no-any
      .forEach((element: any) => {
        if (!ops.find(op => op.dlOpName === element.symbolName)) {
          output.push(`|Not mapped|${element.symbolName}|\n`);
        }
      });
  output.push('\n');
}

genDoc();
