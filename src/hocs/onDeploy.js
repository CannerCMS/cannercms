// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {Map, List} from 'immutable';

type Props = {
  refId: RefId,
  keyName: string,
  routes: Array<string>,
  pattern: string,
  onDeploy: (key: string, id: ?string, callback: any => any) => void,
  removeOnDeploy: (key: string, id: ?string) => void,
  rootValue: any,
};

export default function withOndeploy(Com: React.ComponentType<*>) {
  return class ComponentWithOnDeploy extends React.Component<Props> {
    hasRegistered = false;
    key: string;
    id: ?string;

    constructor(props: Props) {
      super(props);
      const {pattern, refId, rootValue} = props;
      this.hasRegistered = false;
      const {key, id} = splitRefId({
        refId,
        rootValue,
        pattern
      });
      this.key = key;
      this.id = id;
    }

    componentWillUnmount() {
      const {removeOnDeploy} = this.props;
      if (this.hasRegistered) {
        removeOnDeploy(this.key, this.id);
      }
    }

    onDeploy(callback: Function) {
      const {onDeploy, refId} = this.props;
      onDeploy(this.key, this.id, v => {
        const {paths, value} = getValueAndPaths(v, refId.getPathArr());
        return v.setIn(paths, callback(value));
      });
      this.hasRegistered = true;
    }

    render() {
      return <Com {...this.props}
        onDeploy={this.onDeploy}
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
    id = rootValue.getIn([key, 'edges', index, 'cursor']);
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
    if (Map.isMap(v)) {
      if (v.has('edges') && v.has('pageInfo')) {
        v = v.getIn(['edges', key, 'node']);
        paths = paths.concat(['edges', key, 'node']);
      } else {
        v = v.get(key);
        paths = paths.concat(key);
      }
    } else if (List.isList(v)) {
      v = v.get(key);
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