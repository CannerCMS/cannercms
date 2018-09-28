// @flow

import * as React from 'react';
import {mapValues, get, isPlainObject, isArray} from 'lodash';
import type {HOCProps} from './types';

type State = {
  value: any,
  recordValue: Object,
  originRootValue: Object,
  rootValue: Object,
  isFetching: boolean
}

// $FlowFixMe
export default function withContainerRouter(Com: React.ComponentType<*>) {
  return class ContainerWithRouter extends React.Component<HOCProps, State> {
    state = {
      value: {},
      recordValue: {},
      originRootValue: {},
      rootValue: {},
      isFetching: false
    };
    key: string;
    subscription: any;
    constructor(props: HOCProps) {
      super(props);
      this.key = props.refId.getPathArr()[0];
    }

    componentDidMount() {
      if (this.key) {
        this.queryData();
        this.subscribe();
      }
    }

    componentWillUnmount() {
      this.unsubscribe();
    }
    
    queryData = (props?: HOCProps): Promise<*> => {
      const {refId, fetch} = props || this.props;
      return fetch(this.key).then(data => {
        const rootValue = parseConnectionToNormal(data);
        this.setState({
          originRootValue: data,
          rootValue,
          recordValue: getRecordValue(rootValue, refId),
          value: getValue(data, refId.getPathArr()),
          isFetching: false
        });
      });
    }

    subscribe = () => {
      const {subscribe, refId} = this.props;
      const subscription = subscribe(this.key, (data) => {
        const rootValue = parseConnectionToNormal(data);
        this.setState({
          originRootValue: data,
          rootValue,
          recordValue: getRecordValue(rootValue, refId),
          value: getValue(data, refId.getPathArr()),
          isFetching: false
        });
      });
      this.subscription = subscription;
    }

    unsubscribe = () => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    render() {
      const {value, recordValue} = this.state;
      return <Com {...this.props} value={value} recordValue={recordValue}/>;
    }
  };
}

export function getValue(value: Map<string, *>, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    if (isPlainObject(result)) {
      if ('edges' in result && 'pageInfo' in result) {
        return get(result, ['edges', key, 'node']);
      }
      return get(result, key);
    } else if (isArray(result)) {
      return get(result, key);
    } else {
      return result;
    }
  }, value);
}

export function parseConnectionToNormal(value: any) {
  if (isPlainObject(value)) {
    if (value.edges && value.pageInfo) {
      return value.edges.map(edge => parseConnectionToNormal(edge.node));
    }
    return mapValues(value, item => parseConnectionToNormal(item));
  } else if (isArray(value)) {
    return value.map(item => parseConnectionToNormal(item))
  } else {
    return value;
  }
}

function getRecordValue(rootValue, refId) {
  return get(rootValue, refId.getPathArr(), {});
}