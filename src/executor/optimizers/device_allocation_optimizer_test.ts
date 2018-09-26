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

import {Graph, Node} from '../../operations/types';

import {DeviceAllocationOptimizer} from './device_allocation_optimizer';

let optimizer: DeviceAllocationOptimizer;
const EMPTY_GRAPH: Graph = {
  inputs: [],
  nodes: {},
  weights: [],
  outputs: [],
  placeholders: [],
  withControlFlow: false,
  withDynamicShape: false
};

const inputNode: Node = {
  inputNames: [],
  inputs: [],
  children: [],
  name: 'input',
  op: 'placeholder',
  category: 'graph',
  params: {}
};
const constNode: Node = {
  inputNames: [],
  inputs: [],
  children: [],
  name: 'const',
  op: 'const',
  category: 'graph',
  params: {}
};
const intermediateNode: Node = {
  inputNames: ['input', 'const'],
  inputs: [inputNode, constNode],
  children: [],
  name: 'intermediate',
  op: 'shape',
  category: 'arithmetic',
  params: {}
};
const outputNode: Node = {
  inputNames: ['intermediate', 'input'],
  inputs: [intermediateNode, inputNode],
  children: [],
  name: 'output',
  op: 'add',
  category: 'arithmetic',
  params: {}
};
const graph: Graph = {
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

describe('DeviceAllocationOptimizer', () => {
  beforeEach(() => {
    optimizer = new DeviceAllocationOptimizer();
  });

  it('should handle empty graph', () => {
    expect(optimizer.optimize(EMPTY_GRAPH)).toEqual(EMPTY_GRAPH);
  });

  it('should have the same nodes count', () => {
    const count = Object.keys(graph.nodes).length;
    const newNodes = optimizer.optimize(graph).nodes;
    expect(Object.keys(newNodes).length).toEqual(count);
  });

  it('should allocate device for each node', () => {
    const newNodes = optimizer.optimize(graph).nodes;
    expect(Object.keys(newNodes)
               .map(key => newNodes[key])
               .map(node => node.backend)
               .every(backend => !!backend))
        .toBeTruthy();
  });

  it('should allocate input node based on the config', () => {
    let newNodes = optimizer.optimize(graph).nodes;
    expect(newNodes[inputNode.name].backend).toEqual('webgl');

    optimizer = new DeviceAllocationOptimizer('cpu');
    newNodes = optimizer.optimize(graph).nodes;
    expect(newNodes[inputNode.name].backend).toEqual('cpu');
  });

  it('should allocate input node based on the config', () => {
    let newNodes = optimizer.optimize(graph).nodes;
    expect(newNodes[inputNode.name].backend).toEqual('webgl');

    optimizer = new DeviceAllocationOptimizer('cpu');
    newNodes = optimizer.optimize(graph).nodes;
    expect(newNodes[inputNode.name].backend).toEqual('cpu');
  });

  it('should allocate const node to cpu', () => {
    const newNodes = optimizer.optimize(graph).nodes;
    expect(newNodes[constNode.name].backend).toEqual('cpu');
  });

  it('should allocate shape node to cpu', () => {
    const newNodes = optimizer.optimize(graph).nodes;
    expect(newNodes[intermediateNode.name].backend).toEqual('cpu');
  });

  it('should allocate add node to webgl', () => {
    const newNodes = optimizer.optimize(graph).nodes;
    expect(newNodes[outputNode.name].backend).toEqual('webgl');
  });
});
