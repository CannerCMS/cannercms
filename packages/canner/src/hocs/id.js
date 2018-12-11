// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {createEmptyData} from 'canner-helpers';
import {get, update, mapValues, merge} from 'lodash';
import {List} from 'react-content-loader';

import type {HOCProps, Args} from './types';
import type {Query} from '../query';

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
        this.state = {
          canRender: false,
          refId: null
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
      const {routerParams: {operator, payload}, pattern, items, keyName, routes, updateQuery} = props;
      if (operator === 'create' && this.props.routerParams.operator === 'update' && pattern ==='array') {
        // posts => posts?op=create
        let value = createEmptyData(items);
        update(value, 'id', id => id || randomId());
        update(value, '__typename', typename => typename || null);
        this.setState({
          canRender: false
        });
        if (payload) {
          value = merge(value, payload);
        }
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
          canRender: false
        });
        this.fetchById(routes[1], 400);
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
        if (routerParams.payload) {
          value = merge(value, routerParams.payload);
        }
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

    componentWillUnmount() {
      const {updateQuery, keyName, pattern} = this.props;
      
      if (pattern === 'array' && this.args) {
        updateQuery([keyName], this.args);
      }
    }

    fetchById = (id: string, timeIntervale?: number) => {
      const {query, keyName, updateQuery, fetch} = this.props;
      const paths = [keyName];
      const queries = query.getQueries(paths).args || {pagination: {first: 10}};
      const variables = query.getVairables();
      // get current args
      this.args = mapValues(queries, v => variables[v.substr(1)]);
      this.setState({
        canRender: false
      })
      updateQuery(paths, {
        ...this.args,
        where: {id: id},
      }).then(() => fetch(keyName))
        .then(result => {
          let index = 0;	
          if (result[keyName].edges) {	
            index = result[keyName].edges.findIndex(edge => edge.cursor === id);	
          } else {	
            index = result[keyName].findIndex(item => item.id === id);	
          }
          setTimeout(() => {
            this.setState({
              canRender: true,
              refId: new RefId(`${keyName}/${index}`)
            });
          }, timeIntervale || 0)
        });
    }

    createArray = (keyName: string, value: any) => {
      const {fetch, request, updateQuery} = this.props;
      updateQuery([keyName], {first: 0});
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
      if (!canRender) return <List style={{maxWidth: 600}}/>;
      return <Com {...this.props}
        refId={refId}
      />
    }
  };
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}