// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {createEmptyData} from 'canner-helpers';
import {get, update} from 'lodash';
import {Spin, Icon} from 'antd';

import type {HOCProps, Args} from './types';
import type {Query} from '../query';

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;

type State = {
  canRender: boolean,
  refId: RefId
};

export default function connectId(Com: React.ComponentType<*>) {
  return class ComponentConnectId extends React.Component<HOCProps, State> {
    refId: RefId;
    query: Query;
    reset: Function;
    args: Args;

    constructor(props: HOCProps) {
      super(props);
      const {routerParams, pattern, refId, keyName, routes} = props;
      let myRefId = refId;
      // route to children
      if (routerParams.operator === 'create' && pattern === 'array') {
        this.state = {
          canRender: false,
          refId: refId
        };
      } else if (pattern === 'array' && routes.length > 1) {
        // in this case,
        // this hoc will fetch data with query {where: {id: id}} in componentDidMount
        // so the index in refId must be 0
        this.state = {
          canRender: false,
          refId: refId.child(`${keyName}/0`)
        };
      } else {
        myRefId = myRefId ? myRefId.child(keyName) : new RefId(keyName);
        this.state = {
          canRender: true,
          refId: myRefId
        };
      }
    }

    UNSAFE_componentWillReceiveProps(props: HOCProps) {
      const {routerParams: {operator}, pattern, items, keyName, routes, updateQuery} = props;
      if (operator === 'create' && this.props.routerParams.operator === 'update' && pattern ==='array') {
        // posts => posts?op=create
        let value = createEmptyData(items);
        update(value, 'id', id => id || randomId());
        update(value, '__typename', typename => typename || null);
        this.setState({
          canRender: false
        });
        this.createArray(keyName, value);
      }

      if (operator === 'update' && this.props.routerParams.operator === 'create' && pattern === 'array') {
        // posts?op=create => posts
        this.setState({
          refId: new RefId(keyName)
        });
      }

      if (pattern === 'array' && routes.length > 1 && this.props.routes.length === 1) {
        // posts => posts/<postId>
        this.setState({
          refId: new RefId(`${keyName}/0`)
        });
        this.fetchById(routes[1]);
      }

      if (pattern === 'array' && routes.length === 1 && this.args && this.props.routes.length > 1) {
        // posts/<postId> => posts
        this.setState({
          refId: new RefId(`${keyName}`)
        });
        updateQuery([keyName], this.args);
        delete this.args;
      }
    }

    componentDidMount() {
      const {routerParams, pattern, keyName, items, routes} = this.props;
      if (routerParams.operator === 'create' && pattern === 'array') {
        // posts?op=create
        let value = createEmptyData(items);
        update(value, 'id', id => id || randomId());
        update(value, '__typename', typename => typename || null);
        this.createArray(keyName, value);
      } else if (pattern === 'array' && routes.length > 1) {
        // posts/<postId>/title
        this.fetchById(routes[1]);
      } else {
        this.setState({
          canRender: true
        });
      }
    }

    fetchById = (id: string) => {
      const {query, keyName, updateQuery} = this.props;
      const paths = [keyName];
      const queries = query.getQueries(paths).args || {pagination: {first: 10}};
      const variables = query.getVairables();
      this.args =(queries, v => variables[v.substr(1)]);
      updateQuery(paths, {
        ...this.args,
        where: {id: id},
      });
      fetch(keyName)
        .then(() => {
          this.setState({
            canRender: true
          });
        });
    }

    createArray = (keyName: string, value: any) => {
      const {fetch, request} = this.props;
      fetch(keyName)
        .then(result => {
          const size = get(result, [keyName, 'edges']).length;
          // $FlowFixMe
          return request({
            type: 'CREATE_ARRAY',
            payload: {
              id: value.id,
              value,
              key: keyName,
            }
          }).then(() => size);
        })
        .then(size => {
          this.setState({
            canRender: true,
            refId: new RefId(`${keyName}/${size}`)
          });
        });
    }

    render() {
      let {canRender, refId} = this.state;
      if (!canRender) return <Spin indicator={antIcon} />;
      return <Com {...this.props}
        refId={refId}
      />
    }
  };
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}