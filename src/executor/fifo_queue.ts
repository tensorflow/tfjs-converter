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
import {DataType, Tensor, util} from '@tensorflow/tfjs-core';

export interface TensorWithState {
  tensor?: Tensor;
  written?: boolean;
  read?: boolean;
  cleared?: boolean;
}
/**
 * A queue that produces elements in first-in first-out order.
 */
export class FIFOQueue {
  private static nextId = 0;
  private queue: Tensor[][] = [];
  private closed_ = false;
  readonly id: number;
  constructor(
      public readonly dtypes: DataType[], public readonly shapes?: number[][],
      public readonly capacity = -1, public readonly name = '',
      public readonly container = '') {
    this.id = FIFOQueue.nextId++;
  }

  get isClosed() {
    return this.closed_;
  }

  /**
   * Close the current queue.
   */
  close() {
    this.closed_ = true;
  }

  size(): number {
    return this.queue.length;
  }

  /**
   * Enqueues a tuple of one or more tensors in the given queue.
   * @param element
   */
  enqueue(element: Tensor[], dtype?: DataType[]) {
    if (this.closed_) {
      throw new Error(`Queue ${this.name} has been closed.`);
    }
    if (this.capacity >= 0 && this.queue.length >= this.capacity) {
      throw new Error(`Queue ${this.name} has reached maximum capacity.`);
    }

    const dtypes: DataType[] = [];
    element.forEach((tensor, index) => {
      if (this.size() === 0 && this.shapes.length === 0) {
        this.shapes.push(tensor.shape);
      } else {
        this.assertShapesMatch(
            this.shapes[index], tensor.shape,
            `Queue ${this.name} enqueue shape mismatch:`);

        util.assert(
            this.dtypes[index] === tensor.dtype,
            `Queue ${this.name} enqueue Tensor datatypes mismatch: ` +
                `${this.dtypes[index]} vs ${tensor.dtype}.`);
      }
      dtypes.push(tensor.dtype);
    });
    this.queue.push(element);
  }

  /**
   * Enqueues zero or more tuples of one or more tensors in the given queue.
   * @param elements One or more tensors from which the enqueued tensors should
   *     be taken.
   */
  enqueueMany(elements: Tensor[][]) {
    if (this.capacity >= 0 &&
        elements.length > (this.capacity - this.queue.length)) {
      throw new Error(
          `Number of equeueing elements exceeds Queue  ${this.name} capacity.`);
    }
    elements.forEach(element => this.enqueue(element));
  }

  /**
   * Dequeue one element from the given queue.
   */
  dequeue(): Tensor[] {
    if (this.queue.length === 0) {
      // TODO(kangyizhang): wait until element enqueued.
      throw new Error(`Queue ${this.name} is empty.`);
    }
    const element = this.queue[0];
    this.queue.shift();
    return element;
  }

  /**
   * Dequeues n tuples of one or more tensors from the given queue.
   *
   * This operation concatenates queue-element component tensors along the 0th
   * dimension to make a single component tensor. All of the components in the
   * dequeued tuple will have size n in the 0th dimension.
   *
   * This operation has k outputs, where k is the number of components in the
   * tuples stored in the given queue, and output i is the ith component of the
   * dequeued tuple.
   */
  dequeueMany(num: number): Tensor[] {
    if (num < 0 || num > this.queue.length) {
      throw new Error(`Invalid number of dequeueing Queue ${this.name}.`);
    }
    let current = this.dequeue();
    const result = [];
    for (let i = 0; i < current.length; i++) {
      result.push(current[i].reshape([1].concat(this.shapes[i])));
    }

    for (let i = 1; i < num; i++) {
      current = this.dequeue();
      for (let j = 0; j < current.length; j++) {
        const temp = current[j].reshape([1].concat(this.shapes[j]));
        result[j] = result[j].concat(temp, 0);
      }
    }
    return result;
  }

  /**
   * Dequeues n tuples of one or more tensors from the given queue.
   *
   * If there are more than 0 but less than n elements remaining, then instead
   * of throwing an error like dequeueMany, less than n elements are returned.
   * If there are 0 elements left in the queue, then an error is throwed just
   * like in dequeueMany. Otherwise the behavior is identical to dequeueMany:
   *
   * This operation concatenates queue-element component tensors along the 0th
   * dimension to make a single component tensor. All of the components in the
   * dequeued tuple will have size n in the 0th dimension.
   *
   * This operation has k outputs, where k is the number of components in the
   * tuples stored in the given queue, and output i is the ith component of the
   * dequeued tuple.
   */
  dequeueUpTo(num: number, dtypes: DataType[] = []): Tensor[] {
    if (num <= 0) {
      throw new Error(`Invalid number of dequeueing Queue ${this.name}.`);
    }
    let current = this.dequeue();
    const result = [];
    for (let i = 0; i < current.length; i++) {
      result.push(current[i].reshape([1].concat(this.shapes[i])));
    }

    for (let i = 1; this.queue.length && i < num; i++) {
      current = this.dequeue();
      for (let j = 0; j < current.length; j++) {
        const temp = current[j].reshape([1].concat(this.shapes[j]));
        result[j] = result[j].concat(temp, 0);
      }
    }
    return result;
  }

  private assertShapesMatch(
      shapeA: number[], shapeB: number[], errorMessagePrefix = ''): void {
    util.assert(
        this.arraysEqual(shapeA, shapeB),
        errorMessagePrefix + ` Shapes ${shapeA} and ${shapeB} must match.`);
  }

  private arraysEqual(n1: number[], n2: number[]) {
    if (n1.length !== n2.length) {
      return false;
    }
    for (let i = 0; i < n1.length; i++) {
      if (n1[i] !== -1 && n2[i] !== -1 && n1[i] !== n2[i]) {
        return false;
      }
    }
    return true;
  }
}
