// @flow

import * as React from 'react';
import {get, isArray, isPlainObject, set} from 'lodash';
import RefId from 'canner-ref-id';
import type {HOCProps} from './types';

export default function withOndeploy(Com: React.ComponentType<*>) {
  return class ComponentWithOnDeploy extends React.Component<HOCProps> {
    key: string;
    id: ?string;

    constructor(props: HOCProps) {
      super(props);
      const {pattern, refId, rootValue} = props;
      const {key, id} = splitRefId({
        refId,
        rootValue,
        pattern
      });
      this.key = key;
      this.id = id;
    }

    removeOnDeploy = (arg1: string, callbackId: string) => {
      const {removeOnDeploy} = this.props;
      if (callbackId) {
        return removeOnDeploy(arg1, callbackId);
      } else {
        return removeOnDeploy(this.key, arg1);
      }
    }

    onDeploy = (arg1: string | Function, callback: Function): string => {
      const {onDeploy, refId} = this.props;
      if (typeof arg1 === 'string') {
        return onDeploy(arg1, callback);
      } else {
        // first arguments is a function
        return onDeploy(this.key, result => {
          let restPathArr = refId.getPathArr();
          // if (this.id) {
          //   restPathArr = restPathArr.slice(2);
          // } else {
            restPathArr = restPathArr.slice(1);
          // }
          const {paths, value} = getValueAndPaths(result.data, restPathArr);
          return {
            ...result,
            // $FlowFixMe
            data: set(result.data, paths, arg1(value))
          }
        });
      }
    }

    render() {
      return <Com {...this.props}
        onDeploy={this.onDeploy}
        removeOnDeploy={this.removeOnDeploy}
      />
  }
  };
}


export function splitRefId({
  refId,
  rootValue,
  pattern
}: {
  refId: RefId,
  rootValue: any,
  pattern: string
}) {
  const [key, index] = refId.getPathArr();
  let id;
  if (pattern.startsWith('array')) {
    id = get(rootValue, [key, index, 'id']);
  }
  return {
    key,
    id
  }
}

export function getValueAndPaths(value: Map<string, *>, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    let v = result.value;
    let paths = result.paths;
    if (isPlainObject(v)) {
      if ('edges' in v && 'pageInfo' in v) {
        v = get(v, ['edges', key, 'node']);
        paths = paths.concat(['edges', key, 'node']);
      } else {
        v = get(v, key);
        paths = paths.concat(key);
      }
    } else if (isArray(v)) {
      v = get(v, key);
      paths = paths.concat(key);
    }
    return {
      value: v,
      paths
    }
  }, {
    value,
    paths: []
  });
}