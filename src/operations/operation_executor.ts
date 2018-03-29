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

import {NamedTensorsMap} from '../data/index';
import {GraphExecutor} from '../executor';

import * as arithmetic from './executors/arithmetic_executor';
import * as basicMath from './executors/basic_math_executor';
import * as control from './executors/control_executor';
import * as convolution from './executors/convolution_executor';
import * as creation from './executors/creation_executor';
import * as graph from './executors/graph_executor';
import * as logical from './executors/logical_executor';
import * as matrices from './executors/matrices_executor';
import * as normalization from './executors/normalization_executor';
import * as reduction from './executors/reduction_executor';
import * as sliceJoin from './executors/slice_join_executor';
import * as transformation from './executors/transformation_executor';
import {Node} from './index';

/**
 * Executes the op defined by the node object.
 * @param node
 * @param tensorMap contains tensors for executed nodes and weights
 */
export function executeOp(
    node: Node, tensorMap: NamedTensorsMap,
    executor: GraphExecutor): tfc.Tensor[] {
  switch (node.category) {
    case 'arithmetic':
      return arithmetic.executeOp(node, tensorMap, executor);
    case 'basic_math':
      return basicMath.executeOp(node, tensorMap, executor);
    case 'control':
      return control.executeOp(node, tensorMap, executor);
    case 'convolution':
      return convolution.executeOp(node, tensorMap, executor);
    case 'creation':
      return creation.executeOp(node, tensorMap, executor);
    case 'graph':
      return graph.executeOp(node, tensorMap, executor);
    case 'logical':
      return logical.executeOp(node, tensorMap, executor);
    case 'matrices':
      return matrices.executeOp(node, tensorMap, executor);
    case 'normalization':
      return normalization.executeOp(node, tensorMap, executor);
    case 'reduction':
      return reduction.executeOp(node, tensorMap, executor);
    case 'slice_join':
      return sliceJoin.executeOp(node, tensorMap, executor);
    case 'transformation':
      return transformation.executeOp(node, tensorMap, executor);
    default:
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
}
