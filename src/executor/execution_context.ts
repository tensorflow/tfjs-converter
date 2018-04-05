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

export interface ExecutionContextId {
  frameId: string;
  iterationId: number;
}

export class ExecutionContext {
  private contexts: ExecutionContextId[] = [this.newFrame('')];

  constructor() {}

  private newFrame(frameId: string) {
    return {frameId, iterationId: 0};
  }

  get currentContext(): ExecutionContextId {
    return this.contexts[this.contexts.length - 1];
  }

  get currentContextId(): string {
    return (this.currentContext.frameId === '' &&
            this.currentContext.iterationId === 0) ?
        '' :
        `__${this.currentContext.frameId}-${this.currentContext.iterationId}__`;
  }

  enterFrame(frameId: string) {
    if (this.currentContext) {
      this.contexts.push(this.newFrame(frameId));
    }
  }

  exitFrame(): ExecutionContextId {
    if (this.contexts.length <= 1) {
      throw new Error('Cannot exit the root execution frame.');
    }
    return this.contexts.pop();
  }

  nextIteration() {
    if (this.currentContext) {
      this.currentContext.iterationId += 1;
    }
  }

  reset() {
    this.contexts = [this.newFrame('')];
  }
}
