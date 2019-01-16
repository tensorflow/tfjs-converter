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

import * as tf from '@tensorflow/tfjs-core';
import {murmur3} from 'murmurhash-js';

const kStartToken = '<S>';
const kEndToken = '<E>';
const kMaxInputChars = 300;

export function stripTrailingAsciiPunctuation(str: string): string {
  let i = str.length - 1;
  for (; i >= 0; i--) {
    if (!/([.,\/#!$%\^&\*;:{}=\-_`~()\]\[])+$/g.test(str.charAt(i))) {
      break;
    }
  }
  return str.slice(0, i + 1);
}

export function preProcessString(text: string) {
  let outputStr = text.toLowerCase();

  // Remove trailing punctuation
  outputStr = stripTrailingAsciiPunctuation(outputStr);

  return (outputStr.length === 0 || text === kStartToken ||
          text === kEndToken) ?
      text :
      outputStr;
}

export function extractSkipGrams(
    input: string, ngramSize: number, maxSkipSize: number,
    includeAllNgrams: boolean, preprocess: boolean, charLevel: boolean) {
  // Split sentence to words.
  let tokens = [];
  if (charLevel) {
    tokens = input.substr(0, kMaxInputChars).split('');
  } else {
    tokens = input.substr(0, kMaxInputChars).split(' ').filter(x => x);
  }

  tokens.unshift(kStartToken);
  tokens.push(kEndToken);

  // Process tokens
  for (let i = 0; i < tokens.length; ++i) {
    if (preprocess) {
      tokens[i] = preProcessString(tokens[i]);
    }
  }

  // Ignore positional tokens.
  const blacklist =
      new Set([kStartToken, kEndToken, `${kStartToken} ${kEndToken}`]);

  // Invariant:
  // At the i-th iteration, posToNgrams[p] should contain all k-skip-n-grams
  // upto size i that start from position 'p'. Since all skip-grams will
  // also contain skip=0, this will contain all ngrams up to size i as well.
  const posToNgrams: {[key: number]: number[][]} = {};
  // Initialize with unigrams.
  for (let p = 0; p < tokens.length; p++) {
    posToNgrams[p] = posToNgrams[p] || [];
    posToNgrams[p].push([p]);
  }
  for (let nsize = 2; nsize <= ngramSize; nsize++) {
    // To get ngrams of size 'nsize' starting at position p, look for ngrams of
    // size 'nsize-1' at position p to use as a prefix, and try to extend the
    // prefixes from the last token in the ngram.
    // Since we already have unigrams we start with bigrams.
    for (let p = 0; p < tokens.length; p++) {
      // Start looking at ngrams from the end, since the longest ngrams will be
      // added most recently.
      for (let nindex = posToNgrams[p].length - 1; nindex >= 0; nindex--) {
        if (posToNgrams[p][nindex].length < nsize - 1) {
          // Too short for a prefix ngram, no point going further.
          break;
        }
        const lastTokenIndex = posToNgrams[p][nindex][nsize - 2];
        for (let s = 0; s <= maxSkipSize; s++) {
          // Extend the current prefix by adding tokens that are at most
          // maxSkipSize: number away from the last token in the prefix.
          if (lastTokenIndex + s + 1 >= tokens.length) {
            break;
          }
          const copy = posToNgrams[p][nindex].slice();
          copy.push(lastTokenIndex + s + 1);
          posToNgrams[p].push(copy);
        }
      }
    }
  }
  // Now that we have all the possible skip-grams, add them to the output map.
  const ngrams: {[key: string]: number} = {};
  for (let p = 0; p < tokens.length; p++) {
    for (let nindex = 0; nindex < posToNgrams[p].length; nindex++) {
      const words = [];

      for (let i = 0; i < posToNgrams[p][nindex].length; i++) {
        words.push(tokens[posToNgrams[p][nindex][i]]);
      }

      // If includeAllNgrams: bool is false, only include ones that match
      // the specified size.
      if (!includeAllNgrams && words.length !== ngramSize) {
        continue;
      }

      const ngramStr = words.join(' ');
      if (!blacklist.has(ngramStr)) {
        ngrams[ngramStr] = words.length;
      }
    }
  }

  return ngrams;
}

export function getFeatureWeights(
    featureCounts: {[key: string]: number}, batchIds: number[][],
    batchWeights: number[][]) {
  const ids = [];
  const weights = [];
  for (const key of Object.keys(featureCounts)) {
    const featureId = murmur3(key, 0) | 0;
    ids.push(featureId);
    weights.push(featureCounts[key]);
  }

  batchIds.push(ids);
  batchWeights.push(weights);
}

export class StringProjectionOp {
  constructor() {}

  compute(
      inputTensor: tf.Tensor, hashFunction: tf.Tensor2D, method: string,
      ngramSize = 1, maxSkipSize = 1, includeAllNgrams = true,
      preprocess = false, charLevel = false, binaryProjection = true) {
    if (inputTensor.rank !== 1)
      throw new Error(
          `input must be a vector, got shape: #{inputTensor.shape}`);

    const inputValue = inputTensor.dataSync<'string'>();
    const batchSize = inputTensor.shape[0];

    const batchIds: number[][] = [];
    const batchWeights: number[][] = [];
    for (let i = 0; i < batchSize; ++i) {
      const featureCounts = extractSkipGrams(
          inputValue[i], ngramSize, maxSkipSize, includeAllNgrams, preprocess,
          charLevel);
      getFeatureWeights(featureCounts, batchIds, batchWeights);
    }

    if (method === 'dense') {
      return this.denseLshProjection(
          batchSize, hashFunction, batchIds, batchWeights, binaryProjection);
    } else if (method === 'sparse') {
      if (hashFunction.shape[1] > 32) {
        throw new Error(`Hash function should have less than 32 bits: ${
            hashFunction.shape[1]}`);
      }
      return this.sparseLshProjection(
          batchSize, hashFunction, batchIds, batchWeights, binaryProjection);
    } else if (method === 'sparse_dense') {
      if (hashFunction.shape[1] > 32) {
        throw new Error(`Hash function should have less than 32 bits: ${
            hashFunction.shape[1]}`);
      }
      return this.sparseDenseLshProjection(
          batchSize, hashFunction, batchIds, batchWeights, binaryProjection);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }
  }

  private copyArrayBuffer(
      source: Uint8Array, dest: Uint8Array, sourceOffset: number,
      dstOffest: number, size: number) {
    for (let i = 0; i < size; i++) {
      dest[dstOffest + i] = source[sourceOffset + i];
    }
  }

  // compute sign bit of dot product of hash(seed, input) and weight.
  // NOTE: use float as seed, and convert it to double as a temporary
  // solution
  //       to match the trained model. This is going to be changed once the
  //       new model is trained in an optimized method.
  runningSignBit(
      input: number[], weight: number[], seed: number,
      binaryProjection: boolean) {
    let score = 0.0;
    const inputItemBytes = 4;
    let offset = 0;
    const seedSize = 4;
    const keyBytes = seedSize + inputItemBytes;
    const inputData = new Uint8Array(new Int32Array(input).buffer);
    const seedArray = new Uint8Array(new Float32Array([seed]).buffer);
    const keyArray = new Uint8Array(keyBytes);
    this.copyArrayBuffer(seedArray, keyArray, 0, 0, seedSize);
    for (let i = 0; i < input.length; ++i) {
      // Create running hash id and value for current dimension.
      this.copyArrayBuffer(
          inputData, keyArray, offset, seedSize, inputItemBytes);

      const key = String.fromCharCode.apply(null, keyArray);
      const hashSignature = murmur3(key, 0) | 0;
      offset += inputItemBytes;
      score += weight[i] * hashSignature;
    }

    const inverseNormalizer = 0.00000000046566129;

    if (!binaryProjection) {
      return Math.tanh(score * inverseNormalizer);
    }

    return (score > 0) ? 1 : 0;
  }

  sparseLshProjection(
      batchSize: number, hash: tf.Tensor2D, batchIds: number[][],
      batchWeights: number[][], binaryProjection: boolean): tf.Tensor {
    const [numHash, numBits] = hash.shape;
    const outputValues = tf.buffer([batchSize, numHash], 'int32');
    const hashValues = hash.dataSync();
    for (let b = 0; b < batchSize; ++b) {
      for (let i = 0; i < numHash; i++) {
        let hashSignature = 0;
        for (let j = 0; j < numBits; j++) {
          const seed = hashValues[i * hash.shape[1] + j];
          const bit = this.runningSignBit(
              batchIds[b], batchWeights[b], seed, binaryProjection);
          hashSignature = (hashSignature << 1) | bit;
        }

        outputValues.set(hashSignature | (i << numBits), b, i);
      }
    }
    return outputValues.toTensor();
  }

  denseLshProjection(
      batchSize: number, hash: tf.Tensor2D, batchIds: number[][],
      batchWeights: number[][], binaryProjection: boolean): tf.Tensor {
    const [numHash, numBits] = hash.shape;
    const outputValues = tf.buffer([batchSize, hash.size], 'int32');
    const hashValues = hash.dataSync();

    for (let b = 0; b < batchSize; ++b) {
      for (let i = 0; i < numHash; i++) {
        for (let j = 0; j < numBits; j++) {
          const seed = hashValues[i * numBits + j];
          const bit = this.runningSignBit(
              batchIds[b], batchWeights[b], seed, binaryProjection);
          outputValues.set(bit, b, i * numBits + j);
        }
      }
    }
    return outputValues.toTensor();
  }

  sparseDenseLshProjection(
      batchSize: number, hash: tf.Tensor2D, batchIds: number[][],
      batchWeights: number[][], binaryProjection: boolean): tf.Tensor {
    const [numHash, numBits] = hash.shape;
    const hashValues = hash.dataSync();
    const sparseBatchIds = [];
    const sparseBatchWeights = [];

    for (let b = 0; b < batchSize; ++b) {
      const ids = [];
      const weights = [];

      for (let i = 0; i < numHash; i++) {
        let hashSignature = 0;
        for (let j = 0; j < numBits; j++) {
          const seed = hashValues[i * hash.shape[1] + j];
          const bit = this.runningSignBit(
              batchIds[b], batchWeights[b], seed, binaryProjection);
          hashSignature = (hashSignature << 1) | bit;
        }

        ids.push(hashSignature | (i << numBits));
        weights.push(1.0);
      }
      sparseBatchIds.push(ids);
      sparseBatchWeights.push(weights);
    }

    return this.denseLshProjection(
        batchSize,
        hash,
        sparseBatchIds,
        sparseBatchWeights,
        binaryProjection,
    );
  }
}
