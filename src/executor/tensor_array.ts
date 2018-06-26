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
import {concat, stack, Tensor, tensor, unstack} from '@tensorflow/tfjs-core';
import {DType} from '@tensorflow/tfjs-core/dist/types';
import {assertShapesMatch} from '@tensorflow/tfjs-core/dist/util';

export interface TensorWithState {
  tensor?: Tensor;
  written?: boolean;
  read?: boolean;
  cleared?: boolean;
}
/**
 * The TensorArray object keeps an array of Tensors.  It
 * allows reading from the array and writing to the array.
 */
export class TensorArray {
  private tensors: TensorWithState[] = [];
  private closed = false;
  constructor(
      public readonly name: string, public readonly dtype: DType,
      initSize: number, private elementShape: number[],
      public readonly identicalElementShapes: boolean,
      public readonly dynamicSize: boolean,
      public readonly clearAfterRead: boolean) {
    this.tensors.length = initSize;
  }

  clearAndClosed() {
    this.tensors = [];
    this.closed = true;
  }

  size(): number {
    return this.tensors.length;
  }

  read(index: number): Tensor {
    if (this.closed) {
      throw new Error(`TensorArray ${this.name} has already been closed.`);
    }

    if (index < 0 || index >= this.tensors.length) {
      throw new Error(`Tried to read from index ${index}, but array size is: ${
          this.tensors.length}`);
    }

    const tensorWithState = this.tensors[index];
    if (tensorWithState.cleared) {
      throw new Error(
          `TensorArray ${this.name}: Could not read index ${
              index} twice because it was cleared after a previous read ` +
          `(perhaps try setting clear_after_read = false?).`);
    }

    if (this.clearAfterRead) {
      tensorWithState.cleared = true;
    }

    tensorWithState.read = true;
    return tensorWithState.tensor;
  }

  readMany(indices: number[]): Tensor[] {
    return indices.map(index => this.read(index));
  }

  write(index: number, tensor: Tensor) {
    if (this.closed) {
      throw new Error(`TensorArray ${this.name} has already been closed.`);
    }

    if (index < 0 || !this.dynamicSize && index >= this.tensors.length) {
      throw new Error(`Tried to write to index ${
          index}, but array is not resizeable and size is: ${
          this.tensors.length}`);
    }

    const t = this.tensors[index] || {};

    if (tensor.dtype !== this.dtype) {
      throw new Error(`TensorArray ${
          this.name}: Could not write to TensorArray index ${index},
          because the value dtype is ${
          tensor.dtype}, but TensorArray dtype is ${this.dtype}.`);
    }
    assertShapesMatch(
        this.elementShape, tensor.shape,
        `TensorArray ${this.name}: Could not write to TensorArray index ${
            index}.`);

    if (t.read) {
      throw new Error(
          `TensorArray ${this.name}: Could not write to TensorArray index ${
              index}, because it has already been read.`);
    }

    if (t.written) {
      throw new Error(
          `TensorArray ${this.name}: Could not write to TensorArray index ${
              index}, because it has already been written.`);
    }

    t.tensor = tensor;
    t.written = true;

    this.tensors[index] = t;
  }

  writeMany(indices: number[], tensors: Tensor[]) {
    if (indices.length !== tensors.length) {
      throw new Error(
          `TensorArray ${this.name}: could not write multiple tensors,` +
          `because the index size: ${
              indices.length} is not the same as tensors size: ${
              tensors.length}.`);
    }

    indices.map((i, index) => this.write(i, tensors[index]));
  }

  gather(indices: number[]|undefined, dtype: DType): Tensor {
    if (dtype !== this.dtype) {
      throw new Error(`TensorArray dtype is ${
          this.dtype} but gather requested dtype ${dtype}`);
    }

    if (indices === undefined) {
      indices = [];
      for (let i = 0; i < this.size(); i++) {
        indices.push(i);
      }
    }

    if (indices.length === 0) {
      return tensor([], [0].concat(this.elementShape));
    }

    // Read all the PersistentTensors into a vector to keep track of
    // their memory.
    const tensors = this.readMany(indices);

    assertShapesMatch(
        this.elementShape, tensors[0].shape, 'TensorArray shape mismatch: ');

    return stack(tensors, 0);
  }

  concat(dtype: DType): Tensor {
    if (dtype !== this.dtype) {
      throw new Error(`TensorArray dtype is ${
          this.dtype} but concat requested dtype ${dtype}`);
    }

    if (this.size() === 0) {
      return tensor([], [0].concat(this.elementShape));
    }

    const indices = [];
    for (let i = 0; i < this.size(); i++) {
      indices.push(i);
    }
    // Read all the PersistentTensors into a vector to keep track of
    // their memory.
    const tensors = this.readMany(indices);

    assertShapesMatch(
        this.elementShape, tensors[0].shape, 'TensorArray shape mismatch: ');

    return concat(tensors, 0);
  }

  scatter(indices: number[], tensor: Tensor) {
    if (tensor.dtype !== this.dtype) {
      throw new Error(`TensorArray dtype is ${
          this.dtype} but scatter tensor has dtype ${tensor.dtype}`);
    }

    if (indices.length !== tensor.shape[0]) {
      throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${
          indices.length} vs. ${tensor.shape[0]}`);
    }

    if (!this.dynamicSize && this.size() !== tensor.shape[0]) {
      throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${
          indices.length} vs. ${tensor.shape[0]}`);
    }

    const maxIndex = Math.max(...indices);

    if (!this.dynamicSize && maxIndex >= this.size()) {
      throw new Error(`Max scatter index must be < array size (${
          maxIndex}  vs. ${this.size()})`);
    }

    this.writeMany(indices, unstack(tensor, 0));
  }

  split(tensor: Tensor) {
    if (tensor.dtype !== this.dtype) {
      throw new Error(`TensorArray dtype is ${
          this.dtype} but scatter tensor has dtype ${tensor.dtype}`);
    }

    const indices: number[] = [];

    for (let i = 0; i < tensor.shape[0]; i++) {
      indices[i] = i;
    }

    if (!this.dynamicSize && this.size() !== tensor.shape[0]) {
      throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${
          indices.length} vs. ${tensor.shape[0]}`);
    }

    const maxIndex = Math.max(...indices);

    if (!this.dynamicSize && maxIndex >= this.size()) {
      throw new Error(`Max scatter index must be < array size (${
          maxIndex}  vs. ${this.size()})`);
    }

    this.writeMany(indices, unstack(tensor, 0));
  }
}
