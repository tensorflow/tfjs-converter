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
// tslint:disable-next-line:max-line-length
import {DataType, Tensor, util} from '@tensorflow/tfjs-core';

export interface TensorWithState {
  tensor?: Tensor;
  written?: boolean;
  read?: boolean;
  cleared?: boolean;
}
/**
 * A queue implementation that dequeues elements in first-in first-out order.
 */
export class FIFOQueue {
  private static nextId = 0;
  private queue: Tensor[][] = [];
  private closed_ = false;
  readonly id: number;
  constructor(
      public readonly capacity: number,
      public readonly dtypes: DataType[],
      public readonly shapes: number[][],
      public readonly name: string) {
    this.id = FIFOQueue.nextId++;
  }

  get isClosed() {
    return this.closed_;
  }

  /**
   * Close the current queue.
   */
  close(cancelPendingEnqueues = false) {
    if (cancelPendingEnqueues) {
      this.closeAndCancel();
    } else {
      this.closed_ = true;
    }
  }

  closeAndCancel() {
    this.closed_ = true;
  }

  size(): number {
    return this.queue.length;
  }

  /**
   * Write value into the index of the TensorArray.
   * @param index number the index to write to.
   * @param tensor
   */
  enqueue(element: Tensor[]) {
    if (this.closed_) {
      throw new Error(`Queue ${this.name} has already been closed.`);
    }

    const dtypes: DataType[] = [];
    element.forEach((tensor, index) => {
      if(this.size() === 0 && this.shapes.length === 0) {
        this.shapes.push(tensor.shape);
      } else {
          this.assertShapesMatch(this.shapes[index], tensor.shape,
            `Queue shape mismatch: shape of ${index} Tensor in queue element `
            + `${this.shapes[index]} vs shape of enqueueing Tensor shape `
            + `${tensor.shape}`);

          util.assert(this.dtypes[index] ===
            tensor.dtype,
            `Queue ${this.name}: Could not enqueue because Tensor datatypes `
            +`are different`);
      }
      dtypes.push(tensor.dtype);
    });
    this.queue.push(element);
  }

  /**
   * Write value into the index of the TensorArray.
   * @param index number the index to write to.
   * @param tensor
   */
  enqueueMany(elements: Tensor[][]) {
    elements.forEach(element => this.enqueue(element));
  }

  /**
   * Dequeue one element from this queue.
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
   * Helper method to read multiple tensors from the specified indices.
   */
  dequeueMany(num: number): Tensor[][] {
    if (num < 0 || num>this.queue.length) {
      throw new Error(`Invalid number of dequeueing Queue ${this.name}.`);
    }
    const result = [];
    for (let i =0;i<num;i++){
      result.push(this.dequeue());
    }
    return result;
  }

  private assertShapesMatch(
      shapeA: number[], shapeB: number[], errorMessagePrefix = ''): void {
    util.assert(
        this.arraysEqual(shapeA, shapeB),
        errorMessagePrefix + ` Shapes ${shapeA} and ${shapeB} must match`);
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
