
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import {CustomOpExecutor, OpMapper} from '../types';

const CUSTOM_OPS: {[key: string]: OpMapper} = {};

/**
 * Register an Op for graph model executor. This allow you to register
 * TensorFlow custom op or override existing op.
 *
 * @param name The Tensorflow Op name.
 * @param customOp node execution function of type `CustomOpExecutor`.
 */
/** @doc {heading: 'Models', subheading: 'op registry'} */
export function registerOp(name: string, customOp: CustomOpExecutor) {
  const opMapper: OpMapper = {
    tfOpName: name,
    category: 'custom',
    inputs: [],
    attrs: [],
    customExecutor: customOp
  };

  CUSTOM_OPS[name] = opMapper;
}

/**
 * Retrieve the OpMapper object for the registered op.
 *
 * @param name The Tensorflow Op name.
 */
/** @doc {heading: 'Models', subheading: 'op registry'} */

export function getRegisteredOp(name: string): OpMapper {
  return CUSTOM_OPS[name];
}

/**
 * Deregister the Op for graph model executor.
 *
 * @param name The Tensorflow Op name.
 */
/** @doc {heading: 'Models', subheading: 'op registry'} */
export function deregisterOp(name: string) {
  delete CUSTOM_OPS[name];
}
