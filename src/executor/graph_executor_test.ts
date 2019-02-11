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

import * as tfc from '@tensorflow/tfjs-core';

import {createTensorAttr} from '../operations/executors/test_helper';
import {Graph, Node} from '../operations/types';

import {GraphExecutor} from './graph_executor';

let executor: GraphExecutor;
let inputNode: Node;
let constNode: Node;
let intermediateNode: Node;
let rsqrtNode: Node;
let outputNode: Node;
let graph: Graph;
let graphWithControlFlow: Graph;
let constTensor: tfc.Tensor;

describe('GraphExecutor', () => {
  beforeEach(() => {
    inputNode = {
      inputNames: [],
      inputs: [],
      children: [],
      name: 'input',
      op: 'Placeholder',
      category: 'graph',
      attrParams: {},
      inputParams: {}
    };
    constNode = {
      inputNames: [],
      inputs: [],
      children: [],
      name: 'const',
      op: 'Const',
      category: 'graph',
      attrParams: {},
      inputParams: {}

    };
    intermediateNode = {
      inputNames: ['input', 'const'],
      inputs: [inputNode, constNode],
      children: [],
      name: 'intermediate',
      op: 'Add',
      category: 'arithmetic',
      inputParams: {'a': createTensorAttr(0), 'b': createTensorAttr(1)},
      attrParams: {}
    };
    outputNode = {
      inputNames: ['intermediate', 'const'],
      inputs: [intermediateNode, constNode],
      children: [],
      name: 'output',
      op: 'Add',
      category: 'arithmetic',
      inputParams: {'a': createTensorAttr(0), 'b': createTensorAttr(1)},
      attrParams: {}
    };
    graph = {
      inputs: [constNode, inputNode],
      nodes: {
        'input': inputNode,
        'const': constNode,
        'intermediate': intermediateNode,
        'output': outputNode
      },
      outputs: [outputNode],
      weights: [constNode],
      withControlFlow: false,
      withDynamicShape: false,
      placeholders: [inputNode]
    };
    inputNode.children.push(intermediateNode);
    constNode.children.push(intermediateNode, outputNode);
    intermediateNode.children.push(outputNode);
    executor = new GraphExecutor(graph);
    constTensor = tfc.scalar(2.0);
    executor.weightMap = {'const': [constTensor]};
  });
  afterEach(() => {});

  describe('execute graph', () => {
    describe('initialization', () => {
      it('should expose placehoder names', () => {
        expect(executor.inputNodes).toEqual(['input']);
      });

      it('should expose output names', () => {
        expect(executor.outputNodes).toEqual(['output']);
      });

      it('should expose placeholders', () => {
        inputNode.attrParams['shape'] = {value: [1], type: 'shape'};
        inputNode.attrParams['dtype'] = {value: 'float32', type: 'dtype'};
        expect(executor.inputs).toEqual([
          {name: 'input', shape: [1], dtype: 'float32'}
        ]);
      });

      it('should expose outputs', () => {
        outputNode.attrParams['shape'] = {value: [1, 1], type: 'shape'};
        outputNode.attrParams['dtype'] = {value: 'int32', type: 'dtype'};
        expect(executor.outputs).toEqual([
          {name: 'output', shape: [1, 1], dtype: 'int32'}
        ]);
      });
    });

    describe('graph level', () => {
      describe('execute', () => {
        it('should execute the op', () => {
          const inputTensor = tfc.scalar(1);

          const result = executor.execute({input: [inputTensor]});
          tfc.test_util.expectArraysClose(result['output'], [5.0]);
        });

        it('should allow output intermediate nodes', () => {
          const inputTensor = tfc.scalar(1);
          const result = executor.execute(
              {input: [inputTensor]}, false, ['output', 'intermediate']);
          tfc.test_util.expectArraysClose(result['intermediate'], [3.0]);
          tfc.test_util.expectArraysClose(result['output'], [5.0]);
        });

        it('should allow feed intermediate nodes', () => {
          const intermediateTensor = tfc.scalar(1);
          const result =
              executor.execute({intermediate: [intermediateTensor]}, false);
          tfc.test_util.expectArraysClose(result['output'], [3.0]);
        });

        describe('strict input check', () => {
          it('should throw exception if missing inputs', () => {
            expect(() => executor.execute({}))
                .toThrow(new Error(
                    'The dict provided in model.execute(dict) ' +
                    'has the keys [], but is missing the required' +
                    ' keys: [input].'));
          });

          it('should throw exception if contains extra inputs', () => {
            const inputTensor = tfc.scalar(1);
            expect(
                () => executor.execute(
                    {test: [inputTensor], input: [inputTensor]}, true))
                .toThrow(new Error(
                    'The dict provided in model.execute(dict)' +
                    ' has unused keys: [test]. Please provide' +
                    ' only the following keys: [input].'));
          });

          it('should throw exception if inputs shapes mismatch', () => {
            inputNode.attrParams['shape'] = {value: [1, 1], type: 'shape'};
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(() => executor.execute({input: [inputTensor]}))
                .toThrow(new Error(
                    'The shape of dict[\'input\'] provided' +
                    ' in model.execute(dict) must be [1,1], but was [1]'));
          });

          it('should throw exception for dtype mismatch', () => {
            inputNode.attrParams['dtype'] = {value: 'int32', type: 'dtype'};
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(() => executor.execute({input: [inputTensor]}))
                .toThrow(new Error(
                    'The dtype of dict[\'input\'] provided' +
                    ' in model.execute(dict) must be int32, but was float32'));
          });
        });

        describe('outputs check', () => {
          it('should reject missing outputs', () => {
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(
                () => executor.execute(
                    {input: [inputTensor]}, false, ['missing']))
                .toThrow(new Error(
                    `The following outputs are not generated by the execution: ` +
                    `[missing].`));
          });

          it('should reject missing outputs with child tensors', () => {
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(
                () => executor.execute(
                    {input: [inputTensor]}, false, ['missing:0']))
                .toThrow(new Error(
                    `The following outputs are not generated by the execution: ` +
                    `[missing].`));
          });

          it('should accept existing outputs', (done) => {
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(
                () =>
                    executor.execute({input: [inputTensor]}, false, ['output']))
                .not.toThrow(new Error(
                    `The following outputs are not generated by the execution: ` +
                    `[output].`));
            done();
          });

          it('should accept existing outputs with child tensors', (done) => {
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(
                () => executor.execute(
                    {input: [inputTensor]}, false, ['output:0']))
                .not.toThrow(new Error(
                    `The following outputs are not generated by the execution: ` +
                    `[output].`));
            done();
          });
        });

        describe('non strict input check', () => {
          it('should not throw exception if missing inputs', () => {
            expect(() => executor.execute({}, false))
                .not.toThrow(new Error(
                    'The dict provided in model.execute(dict) ' +
                    'has the keys [], but is missing the required' +
                    ' keys: [input].'));
          });

          it('should not throw exception if contains extra inputs', () => {
            const inputTensor = tfc.scalar(1);
            expect(
                () => executor.execute(
                    {intermediate: [inputTensor], input: [inputTensor]}, false))
                .not.toThrow(new Error(
                    'The dict provided in model.execute(dict)' +
                    ' has unused keys: [test]. Please provide' +
                    ' only the following keys: [input].'));
          });
          it('should throw exception if contains inputs no in the graph',
             () => {
               const inputTensor = tfc.scalar(1);
               expect(
                   () => executor.execute(
                       {test: [inputTensor], input: [inputTensor]}, false))
                   .not.toThrow(new Error(
                       'The dict provided in model.execute(dict)' +
                       ' has unused keys: [test]. Please provide' +
                       ' only the following keys: [input].'));
             });
          it('should throw exception if inputs shapes mismatch', () => {
            inputNode.attrParams['shape'] = {value: [1, 1], type: 'shape'};
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(() => executor.execute({input: [inputTensor]}, false))
                .toThrow(new Error(
                    'The shape of dict[\'input\'] provided' +
                    ' in model.execute(dict) must be [1,1], but was [1]'));
          });

          it('should throw exception dtype mismatch', () => {
            inputNode.attrParams['dtype'] = {value: 'int32', type: 'dtype'};
            const inputTensor = tfc.tensor1d([1], 'float32');
            expect(() => executor.execute({input: [inputTensor]}, false))
                .toThrow(new Error(
                    'The dtype of dict[\'input\'] provided' +
                    ' in model.execute(dict) must be int32, but was float32'));
          });
        });

        it('should not throw exception if inputs shapes is dynamic', () => {
          inputNode.attrParams['shape'] = {value: [-1, 1, 1, 1], type: 'shape'};
          const inputTensor = tfc.tensor4d([1, 1], [2, 1, 1, 1], 'float32');
          expect(() => executor.execute({input: [inputTensor]})).not.toThrow();
        });
      });

      describe('executeAsync', () => {
        beforeEach(() => {
          inputNode = {
            inputNames: [],
            inputs: [],
            children: [],
            name: 'input',
            op: 'Placeholder',
            category: 'graph',
            attrParams: {},
            inputParams: {}
          };
          constNode = {
            inputNames: [],
            inputs: [],
            children: [],
            name: 'const',
            op: 'Const',
            category: 'graph',
            attrParams: {},
            inputParams: {}
          };
          intermediateNode = {
            inputNames: ['input', 'const'],
            inputs: [inputNode, constNode],
            children: [],
            name: 'intermediate',
            op: 'Add',
            category: 'arithmetic',
            inputParams: {'a': createTensorAttr(0), 'b': createTensorAttr(1)},
            attrParams: {}
          };
          rsqrtNode = {
            inputNames: ['intermediate'],
            inputs: [intermediateNode],
            children: [],
            name: 'rsqrt',
            op: 'Rsqrt',
            category: 'basic_math',
            inputParams: {'x': createTensorAttr(0)},
            attrParams: {}
          };
          outputNode = {
            inputNames: ['const', 'rsqrt'],
            inputs: [constNode, rsqrtNode],
            children: [],
            name: 'output',
            op: 'Switch',
            category: 'control',
            inputParams:
                {'pred': createTensorAttr(0), 'data': createTensorAttr(1)},
            attrParams: {}
          };
          inputNode.children.push(intermediateNode);
          constNode.children.push(intermediateNode, outputNode);
          intermediateNode.children.push(rsqrtNode);
          rsqrtNode.children.push(outputNode);
          graphWithControlFlow = {
            inputs: [constNode, inputNode],
            nodes: {
              'input': inputNode,
              'const': constNode,
              'intermediate': intermediateNode,
              'rsqrt': rsqrtNode,
              'output': outputNode
            },
            outputs: [outputNode],
            weights: [constNode],
            withControlFlow: true,
            withDynamicShape: false,
            placeholders: [inputNode]
          };

          executor = new GraphExecutor(graphWithControlFlow);
          executor.weightMap = {const : [constTensor]};
        });

        it('should execute control flow graph', async (done: DoneFn) => {
          const inputTensor = tfc.scalar(1);

          const result =
              await executor.executeAsync({input: [inputTensor]}, 'output:1');
          tfc.test_util.expectArraysClose(result['output:1'], [0.57735]);
          done();
        });

        it('should allow output intermediate nodes', async (done: DoneFn) => {
          const inputTensor = tfc.scalar(1);
          const result = await executor.executeAsync(
              {input: [inputTensor]}, ['intermediate']);
          tfc.test_util.expectArraysClose(result['intermediate'], [3.0]);
          done();
        });

        it('should be able to execute control flow graph ' +
               'with intermediate node more than once',
           async (done: DoneFn) => {
             const inputTensor = tfc.scalar(1);

             const result = await executor.executeAsync(
                 {intermediate: [inputTensor]}, 'output:1');
             tfc.test_util.expectArraysClose(result['output:1'], [1]);
             const result2 = await executor.executeAsync(
                 {intermediate: [inputTensor]}, 'output:1');
             tfc.test_util.expectArraysClose(result2['output:1'], [1]);

             done();
           });

        it('should not have mem leak', async (done) => {
          const inputTensor = tfc.scalar(1);
          const numTensors: number = tfc.memory().numTensors;

          await executor.executeAsync({input: [inputTensor]}, ['output:1']);
          expect(tfc.memory().numTensors).toEqual(numTensors + 1);
          done();
        });
      });
    });
  });
});
