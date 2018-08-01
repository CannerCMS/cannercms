// @flow

import * as React from 'react';
import {Spin, Icon} from 'antd';
import {Map, List, is, fromJS} from 'immutable';
import Toolbar from './components/toolbar';
import {mapValues} from 'lodash';
import type {HOCProps} from './types';

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;

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
        return <Spin indicator={antIcon} />;
      }
      if (pattern === 'array') {
        const queries = query.getQueries(path.split('/')).args || {pagination: {first: 10}};
        const variables = query.getVairables();
        const args = mapValues(queries, v => variables[v.substr(1)]);
        return <Toolbar items={items} toolbar={toolbar} args={args} query={query} refId={refId} value={value || (defaultValue('connection'): any)} updateQuery={this.updateQuery}>
          <Com {...this.props} showPagination={false} rootValue={rootValue} value={value ? value.getIn(['edges'], new List()).map(item => item.get('node')) : defaultValue('array')} />
        </Toolbar>;
      } else if (type === 'relation' && relation.type === 'toOne') {
        return <Com {...this.props} showPagination={true} rootValue={rootValue} value={(value && value.get('id')) ? value : defaultValue(type, relation)} />;
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

function defaultValue(type: string, relation: any) {
  switch (type) {
    case 'connection': {
      return fromJS({
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      })
    }
    case 'array': {
      return new List();
    }
    case 'object': {
      return new Map();
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
        return fromJS({
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        });
      } else {
        return null;
      }
    }
    case 'image':
    case 'file': {
      return fromJS({
        url: '',
        contentType: '',
        name: '',
        size: 0,
        __typename: null
      })
    }
    case 'geoPoint': {
      return fromJS({
        placeId: '',
        address: '',
        lat: 122,
        lng: 23
      });
    }
    default: {
      return null;
    }
  }
}