#!/usr/bin/env bash
# Copyright 2018 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# =============================================================================

set -e

tsc --project tsconfig-es5.json
tsc

copyfiles -f src/data/compiled_api.* dist/data
copyfiles -f src/operations/op_list/*.json dist/operations/op_list
copyfiles -f src/operations/typings.d.ts dist/operations

copyfiles -f src/data/compiled_api.* dist-es6/data
copyfiles -f src/operations/op_list/*.json dist-es6/operations/op_list
copyfiles -f src/operations/typings.d.ts dist-es6/operations
