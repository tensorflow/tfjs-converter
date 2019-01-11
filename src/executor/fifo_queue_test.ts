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

import {DataType, ones, Tensor, tensor2d} from '@tensorflow/tfjs-core';
import {FIFOQueue} from './fifo_queue';

let queue: FIFOQueue;
let element1: Tensor[];
let element2: Tensor[];
const NAME = 'FQ1';
const DTYPE: DataType[] = ['int32'];
const SIZE = 10;
const SHAPE = [[1, 1]];

describe('FIFOQueue', () => {
  beforeEach(() => {
    queue = new FIFOQueue(
        DTYPE,
        SHAPE,
        SIZE,
        NAME,
    );
    element1 = [tensor2d([1], [1, 1], 'int32')];
    element2 = [tensor2d([2], [1, 1], 'int32')];
  });
  afterEach(() => queue.close());

  it('should initialize', () => {
    expect(queue.size()).toEqual(0);
    expect(queue.name).toEqual(NAME);
    expect(queue.isClosed).toBeFalsy();
  });

  it('enqueue one tensor', () => {
    queue.enqueue(element1);
    expect(queue.size()).toEqual(1);
  });

  it('enqueue element with multiple tensors', () => {
    const queue = new FIFOQueue(
        ['int32', 'int32'],
        [[1, 1], [1, 1]],
        SIZE,
        'FQ2',
    );
    queue.enqueue(element1.concat(element2));
    expect(queue.size()).toEqual(1);
  });

  it('enqueue multiple times', () => {
    queue.enqueue(element1);
    expect(queue.size()).toEqual(1);
    queue.enqueue(element2);
    expect(queue.size()).toEqual(2);
  });

  it('enqueueMany', () => {
    queue.enqueueMany([element1, element2]);
    expect(queue.size()).toEqual(2);
    expect(queue.dequeue()).toBe(element1);
    expect(queue.size()).toEqual(1);
    expect(queue.dequeue()).toBe(element2);
    expect(queue.size()).toEqual(0);
  });

  it('enqueueMany elements with multiple tensors', () => {
    const queue = new FIFOQueue(
        ['int32', 'int32'],
        [[1, 1], [1, 1]],
        SIZE,
        'FQ2',
    );
    const element1 =
        [tensor2d([1], [1, 1], 'int32'), tensor2d([1], [1, 1], 'int32')];
    const element2 =
        [tensor2d([1], [1, 1], 'int32'), tensor2d([1], [1, 1], 'int32')];
    queue.enqueueMany([element1, element2]);
    expect(queue.size()).toEqual(2);
  });

  it('enqueue wrong shape element', async done => {
    try {
      queue.enqueue([ones([2, 2], 'int32')]);
    } catch (e) {
      expect(e.message).toEqual(
          'Queue FQ1 enqueue shape mismatch: Shapes 1,1 and 2,2 must match.');
      done();
    }
  });

  it('enqueue wrong dtype element', async done => {
    try {
      queue.enqueue([ones([1, 1], 'float32')]);
    } catch (e) {
      expect(e.message).toEqual(
          'Queue FQ1 enqueue Tensor datatypes mismatch: int32 vs float32.');
      done();
    }
  });

  it('enqueue exceed capacity', async done => {
    try {
      for (let i = 0; i < 10; i++) {
        queue.enqueue([tensor2d([1], [1, 1], 'int32')]);
      }
      queue.enqueue(element1);
      done.fail();
    } catch (e) {
      expect(e.message).toEqual('Queue FQ1 has reached maximum capacity.');
      done();
    }
  });

  it('enqueueMany exceed capacity', async done => {
    try {
      queue.enqueueMany([element1, element2]);
      const elements = [];
      for (let i = 0; i < 10; i++) {
        elements.push([tensor2d([1], [1, 1], 'int32')]);
      }
      queue.enqueueMany(elements);
      done.fail();
    } catch (e) {
      expect(e.message).toEqual(
          'Number of equeueing elements exceeds Queue  FQ1 capacity.');
      done();
    }
  });

  it('enqueue closed queue throw error', async done => {
    try {
      queue.enqueue(element1);
      queue.close();
      queue.enqueue(element2);
      done.fail();
    } catch (e) {
      expect(e.message).toEqual('Queue FQ1 has been closed.');
      done();
    }
  });

  it('denqueue one tensor', () => {
    queue.enqueue(element1);
    expect(queue.size()).toEqual(1);
    expect(queue.dequeue()).toBe(element1);
    expect(queue.size()).toEqual(0);
  });

  it('dnqueue element with multiple tensors', () => {
    const queue = new FIFOQueue(
        ['int32', 'int32'],
        [[1, 1], [1, 1]],
        SIZE,
        'FQ2',
    );
    queue.enqueue(element1.concat(element2));
    const elements = queue.dequeue();
    expect(elements[0]).toBe(element1[0]);
    expect(elements[1]).toBe(element2[0]);
  });

  it('denqueue multiple times', () => {
    queue.enqueue(element1);
    queue.enqueue(element2);
    expect(queue.dequeue()).toBe(element1);
    expect(queue.size()).toEqual(1);
    expect(queue.dequeue()).toBe(element2);
    expect(queue.size()).toEqual(0);
  });

  it('denqueueMany', () => {
    queue.enqueue(element1);
    queue.enqueue(element2);
    const elements = queue.dequeueMany(2);
    expect(elements[0].dataSync())
        .toEqual(element1[0].concat(element2[0], 0).dataSync());
    expect(queue.size()).toEqual(0);
  });

  it('denqueueMany elements with multiple tensors', () => {
    const queue = new FIFOQueue(
        ['int32', 'int32'],
        [[2, 2], [2, 2]],
        SIZE,
        'FQ2',
    );
    const element1 = [ones([2, 2], 'int32'), ones([2, 2], 'int32')];
    const element2 = [ones([2, 2], 'int32'), ones([2, 2], 'int32')];
    queue.enqueueMany([element1, element2]);
    expect(queue.size()).toEqual(2);
    const elements = queue.dequeueMany(2);
    expect(elements[0].dataSync())
        .toEqual(element1[0].concat(element2[0], 0).dataSync());
    expect(elements[1].dataSync())
        .toEqual(element1[1].concat(element2[1], 0).dataSync());
    expect(queue.size()).toEqual(0);
  });

  it('denqueueUpTo with enough elements', () => {
    queue.enqueue(element1);
    queue.enqueue(element2);
    const elements = queue.dequeueUpTo(2);
    expect(elements.length).toEqual(element1.length);
    expect(elements[0].shape[0]).toEqual(2);
    expect(elements[0].dataSync())
        .toEqual(element1[0].concat(element2[0], 0).dataSync());
    expect(queue.size()).toEqual(0);
  });

  it('denqueueUpTo with not enough elements', () => {
    queue.enqueue(element1);
    queue.enqueue(element2);
    const elements = queue.dequeueUpTo(5);
    expect(elements.length).toEqual(element1.length);
    expect(elements[0].shape[0]).toEqual(2);
    expect(elements[0].dataSync())
        .toEqual(element1[0].concat(element2[0], 0).dataSync());
    expect(queue.size()).toEqual(0);
  });

  it('denqueue empty queue', async done => {
    try {
      expect(queue.size()).toEqual(0);
      queue.dequeue();
      done.fail();
    } catch (e) {
      expect(e.message).toEqual('Queue FQ1 is empty.');
      done();
    }
  });

  it('denqueueMany with not enough elements', async done => {
    try {
      queue.enqueue(element1);
      queue.enqueue(element2);
      queue.dequeueMany(5);
      done.fail();
    } catch (e) {
      expect(e.message).toEqual('Invalid number of dequeueing Queue FQ1.');
      done();
    }
  });
});
