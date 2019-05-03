import {NamedTensorsMap} from '../../data/types';
import {ExecutionContext} from '../../executor/execution_context';
import {getParamValue} from '../executors/utils';
import {Node, ValueType} from '../types';

/**
 * Helper class for lookup inputs and params for nodes in the model graph.
 */
export class NodeValue {
  constructor(
      private node: Node, private tensorMap: NamedTensorsMap,
      private context: ExecutionContext) {}

  /**
   * Return the value of the attribute or input param.
   * @param name String: name of attribute or input param.
   */
  get(name: string): ValueType {
    return getParamValue(name, this.node, this.tensorMap, this.context);
  }
}
