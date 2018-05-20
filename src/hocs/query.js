// @flow

import * as React from 'react';
import {Spin, Icon} from 'antd';
import type RefId from 'canner-ref-id';
import {Map, List, is} from 'immutable';
import Toolbar from './components/toolbar';
import type {Query} from '../query';
import {mapValues} from 'lodash';

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;

type Props = {
  type: string,
  items: Object,
  refId: RefId,
  query: Query,
  fetch: FetchDef,
  subscribe: SubscribeDef,
  updateQuery: Function,
  ui: string,
  path: string,
  pattern: string,
  relation: {
    type: string,
    to: string
  },
  toolbar: {
    sort?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    pagination?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    filter?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    toolbarLayout?: {
      component?: React.ComponentType<*>,
      [string]: *
    }
  }
};

type State = {
  value: any,
  rootValue: any,
  originRootValue: any,
  isFetching: boolean,
}

export default function withQuery(Com: React.ComponentType<*>) {
  // this hoc will fetch data;
  return class ComponentWithQuery extends React.PureComponent<Props, State> {
    key: string;
    subscription: any;

    constructor(props: Props) {
      super(props);
      this.state = {
        value: null,
        rootValue: null,
        originRootValue: null,
        isFetching: true
      };
      this.key = props.refId.getPathArr()[0];
    }

    componentDidMount() {
      this.queryData();
    }

    UNSAFE_componentWillReceiveProps(props: Props) {
      const {refId} = this.props;
      
      if (refId.toString() !== props.refId.toString()) {
        this.queryData(props);
      } 
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    getRootValue = () => {
      return this.state.rootValue;
    }

    queryData = (props?: Props): Promise<*> => {
      const {refId, fetch} = props || this.props;
      return fetch(this.key).then(data => {
        this.setState({
          originRootValue: data,
          rootValue: parseConnectionToNormal(data),
          value: getValue(data, refId.getPathArr()),
          isFetching: false
        });
        this.subscribe();
      });
    }

    unsubscribe = () => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    subscribe = () => {
      const {subscribe, refId} = this.props;
      const subscription = subscribe(this.key, (newOriginRootValue) => {
        const {originRootValue} = this.state
        if (shouldUpdate(originRootValue, newOriginRootValue)) {
          this.setState({
            originRootValue: newOriginRootValue,
            rootValue: parseConnectionToNormal(newOriginRootValue),
            value: getValue(newOriginRootValue, refId.getPathArr()),
          });
        }
      });
      this.subscription = subscription;
    }

    render() {
      const {value, isFetching, rootValue} = this.state;
      const {toolbar, query, refId, items, type, path, relation, updateQuery, pattern} = this.props;
      if (isFetching) {
        return <Spin indicator={antIcon} />;
      }
      if (pattern === 'array' || (type === 'relation' && relation.type === 'toMany')) {
        const queries = query.getQueries(path.split('/')).args || {pagination: {first: 10}};
        const variables = query.getVairables();
        const args = mapValues(queries, v => variables[v]);
        return <Toolbar items={items} toolbar={toolbar} args={args} query={query} refId={refId} value={value} updateQuery={updateQuery}>
          <Com {...this.props} rootValue={rootValue} value={value.getIn(['edges'], new List()).map(item => item.get('node'))} />
        </Toolbar>;
      } else if (type === 'relation' && relation.type === 'toOne') {
        const queries = query.getQueries(path.split('/')).args || {pagination: {first: 10}};
        const variables = query.getVairables();
        const args = mapValues(queries, v => variables[v]);
        return <Toolbar items={items} toolbar={toolbar} args={args} query={query} refId={refId} value={value} updateQuery={updateQuery}>
          <Com {...this.props} rootValue={rootValue} value={value || new Map()} />
        </Toolbar>;
      }
      return <Com {...this.props} rootValue={rootValue} value={value} />;
    }
  };
}

export function getValue(value: Map<string, *>, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    if (Map.isMap(result)) {
      if (result.has('edges') && result.has('pageInfo')) {
        return result.getIn(['edges', key, 'node']);
      }
      return result.get(key);

    } else if (List.isList(result)) {
      return result.get(key);
    } else {
      return result;
    }
  }, value);
}

export function parseConnectionToNormal(value: Map<string, *> | List<*>) {
  if (Map.isMap(value)) {
    value = ((value: any): Map<string, any>);
    if (value.has('edges') && value.has('pageInfo')) {
      return (value.get('edges'): any).map(edge => parseConnectionToNormal(edge.get('node')));
    }
    return value.map(item => parseConnectionToNormal(item));
  } else if (List.isList(value)) {
    return value.map(item => parseConnectionToNormal(item))
  } else {
    return value;
  }
}

function shouldUpdate(value: any, newValue: any) {
  return !is(value, newValue);
}