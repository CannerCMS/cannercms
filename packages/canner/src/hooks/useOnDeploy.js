// @flow

import {useContext} from 'react';
import {Context} from 'canner-helpers';
import RefId from 'canner-ref-id';
import {set, get, isArray, isPlainObject} from 'lodash';

export default function({
  onDeploy,
  removeOnDeploy,
  refId,
}: {
  onDeploy: Function,
  removeOnDeploy: Function,
  refId: RefId,
}) {
  const {routes} = useContext(Context);
  const firstKey = routes[0];
  const _removeOnDeploy = (arg1: string, callbackId: string) => {
    if (callbackId) {
      return removeOnDeploy(arg1, callbackId);
    } else {
      return removeOnDeploy(firstKey, arg1);
    }
  }

  const _onDeploy = (arg1: string | Function, callback: Function): string => {
    if (typeof arg1 === 'string') {
      return onDeploy(arg1, callback);
    } else {
      // first arguments is a function
      return onDeploy(firstKey, result => {
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
  return {
    removeOnDeploy: _removeOnDeploy,
    onDeploy: _onDeploy
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