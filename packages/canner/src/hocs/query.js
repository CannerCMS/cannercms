// @flow

import * as React from 'react';
import { List } from 'react-content-loader'
import Toolbar from './components/toolbar';
import {mapValues, get, isPlainObject, isArray} from 'lodash';
import type {HOCProps} from './types';

type State = {
  value: any,
  rootValue: any,
  originRootValue: any,
  isFetching: boolean,
}

export default function withQuery(Com: React.ComponentType<*>) {
  // this hoc will fetch data;
  return class ComponentWithQuery extends React.PureComponent<HOCProps, State> {
    key: string;
    subscription: any;

    constructor(props: HOCProps) {
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
      // defaultSort
      const {pattern, path, query, updateQuery, refId} = this.props;
      if (pattern === 'array') {
        const queries = query.getQueries(path.split('/')).args || {pagination: {first: 10}};
        const variables = query.getVairables();
        const args = mapValues(queries, v => variables[v.substr(1)]);
        const paths = refId.getPathArr();
        updateQuery(paths, {
          ...args,
          where: {}
        });
      }
      this.queryData();
      this.subscribe();
    }

    UNSAFE_componentWillReceiveProps(props: HOCProps) {
      const {refId} = this.props;
      if (refId.toString() !== props.refId.toString()) {
        // refetch when route change
        this.queryData(props);
        this.subscribe();
      }
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    queryData = (props?: HOCProps): Promise<*> => {
      const {refId, fetch} = props || this.props;
      return fetch(this.key).then(data => {
        this.setState({
          originRootValue: data,
          rootValue: parseConnectionToNormal(data),
          value: getValue(data, refId.getPathArr()),
          isFetching: false
        });
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

    updateQuery = (paths: Array<string>, args: Object) => {
      const {updateQuery} = this.props;
      const reWatch = updateQuery(paths, args);
      if (reWatch) {
        // if graphql query changes, it have to rewatch the new observableQuery
        this.unsubscribe();
        this.queryData();
        this.subscribe();
      }
    }

    render() {
      const {value, isFetching, rootValue} = this.state;
      const {toolbar, query, refId, items, type, path, relation, pattern} = this.props;
      if (isFetching) {
        return <List style={{maxWidth: '600px'}}/>;
      }
      if (pattern === 'array') {
        const queries = query.getQueries(path.split('/')).args || {pagination: {first: 10}};
        const variables = query.getVairables();
        const args = mapValues(queries, v => variables[v.substr(1)]);
        return <Toolbar items={items} toolbar={toolbar} args={args} query={query} refId={refId} value={value || (defaultValue('connection'): any)} updateQuery={this.updateQuery}>
          <Com {...this.props} showPagination={false} rootValue={rootValue} value={value ? get(value, 'edges', []).map(item => item.node) : defaultValue('array')} />
        </Toolbar>;
      } else if (type === 'relation' && relation.type === 'toOne') {
        return <Com {...this.props} showPagination={true} rootValue={rootValue} value={(value && value.id) ? value : defaultValue(type, relation)} />;
      } else if (type === 'relation' && relation.type === 'toMany') {
        return (
          <Com {...this.props} showPagination={true} rootValue={rootValue} value={value || defaultValue('array')}/>
        );
      }
      return <Com {...this.props} showPagination={true} rootValue={rootValue} value={value || defaultValue(type, relation)} />;
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

function shouldUpdate(value: any, newValue: any) {
  return value != newValue;
}

function defaultValue(type: string, relation: any) {
  switch (type) {
    case 'connection': {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      }
    }
    case 'array': {
      return [];
    }
    case 'object': {
      return {};
    }
    case 'boolean': {
      return false;
    }
    case 'number': {
      return 0;
    }
    case 'string': {
      return '';
    }
    case 'relation': {
      if (relation.type === 'toMany') {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        };
      } else {
        return null;
      }
    }
    case 'image':
    case 'file': {
      return {
        url: '',
        contentType: '',
        name: '',
        size: 0,
        __typename: null
      }
    }
    case 'geoPoint': {
      return {
        placeId: '',
        address: '',
        lat: 122,
        lng: 23
      };
    }
    default: {
      return null;
    }
  }
}