/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {Tensor} from '@tensorflow/tfjs-core';

import {NamedTensorsMap} from '../data';
import {Node} from '../operations';
// import {parseNodeName} from '../operations/executors/utils';

const ROOT = '__ROOT__';
export interface ExecutionContextId {
  id: number;
  frameName: string;
  iterationId: number;
}

export class ExecutionContext {
  private rootContext = {id: 0, frameName: '', iterationId: 0};
  private contexts: ExecutionContextId[] = [this.rootContext];
  private _currentId = 0;
  private lastId = 0;
  private node: Node;

  contextIdMap: {[key: string]: {[key: string]: ExecutionContextId[]}} = {};

  constructor(public weightMap: NamedTensorsMap) {}

  private newFrame(id: number, frameName: string) {
    return {id, frameName, iterationId: 0};
  }

  set currentNode(node: Node) {
    this.node = node;
    this.currentContext =
        this.contextIdMap[node.name]['last'] || [this.rootContext];
    // this.currentContext = node.inputNames.reduce((pre, curr) => {
    //   const [input, ] = parseNodeName(curr || '');
    //   const preId = this.contextIdforContexts(pre);
    //   const currId =
    //       this.contextIdforContexts(this.contextIdMap[node.name][input]);
    //   return preId > currId ? pre : this.contextIdMap[node.name][input];
    // }, [this.rootContext]);
  }

  set currentContext(contexts: ExecutionContextId[]) {
    this.contexts = contexts;
  }
  get currentId(): number {
    return this._currentId;
  }

  get currentContext(): ExecutionContextId[] {
    return this.contexts;
  }

  get currentContextId(): string {
    return this.contextIdforContexts(this.contexts);
  }

  get currentContextIds(): string[] {
    const names = [];
    if (this.node) {
      for (let i = 0; i < this.contexts.length - 1; i++) {
        const contexts = this.contexts.slice(0, this.contexts.length - i);
        names.push(this.contextIdforContexts(contexts));
      }
    }
    names.push('');
    return names;
  }

  private contextIdforContexts(contexts: ExecutionContextId[]) {
    return contexts ?
        contexts
            .map(
                context => (context.id === 0 && context.iterationId === 0) ?
                    '' :
                    `${context.frameName}-${context.iterationId}`)
            .join('/') :
        '';
  }

  initializeContext(inputs: Node[]) {
    inputs.forEach(input => {
      this.contextIdMap[input.name] = {};
      this.contextIdMap[input.name][ROOT] = [this.rootContext];
    });
  }
  enterFrame(frameId: string) {
    if (this.contexts) {
      this.lastId++;
      this.contexts = this.contexts.slice();
      this.contexts.push(this.newFrame(this.lastId, frameId));
    }
  }

  exitFrame() {
    if (this.contexts && this.contexts.length > 1) {
      this.contexts = this.contexts.slice();
      this.contexts.splice(-1);
    } else {
      throw new Error('Cannot exit frame, the context is empty');
    }
  }

  nextIteration() {
    if (this.contexts && this.contexts.length > 0) {
      this.contexts = this.contexts.slice();
      this.lastId++;
      const context =
          Object.assign({}, this.contexts[this.contexts.length - 1]) as
          ExecutionContextId;
      context.iterationId += 1;
      context.id = this.lastId;
      this.contexts.splice(-1, 1, context);
    } else {
      throw new Error('Cannot increase frame iteration, the context is empty');
    }
  }

  getWeight(name: string): Tensor[] {
    return this.weightMap[name];
  }
}
