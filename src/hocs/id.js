// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import type {Query} from '../query';
import {createEmptyData} from 'canner-helpers';

type Props = {
  refId: RefId,
  keyName: string,
  routes: Array<string>,
  pattern: string,
  params: Object,
  request: Function,
  items: Object,
  fetch: Function
};

type State = {
  canRender: boolean,
  refId: RefId
};

export default function connectId(Com: React.ComponentType<*>) {
  return class ComponentConnectId extends React.Component<Props, State> {
    refId: RefId;
    query: Query;
    reset: ResetDef;

    constructor(props: Props) {
      super(props);
      const {params, pattern, refId, keyName, routes} = props;
      let myRefId = refId;
      // route to children
      
      if (params.op === 'create' && pattern === 'array') {
        this.state = {
          canRender: false,
          refId: refId
        };
      } else {
        if (isChildrenOfArray(pattern) && routes.length > 1 && refId.getPathArr().length === 1) {
          myRefId = refId.child(routes[1]);
        }
        myRefId = myRefId ? myRefId.child(keyName) : new RefId(keyName);
        this.state = {
          canRender: true,
          refId: myRefId
        };
      }
    }

    UNSAFE_componentWillReceiveProps(props: Props) {
      const {params, pattern, items, keyName, request, fetch} = props;
      if (params.op === 'create' && !this.props.params.op && pattern ==='array') {
        let value = createEmptyData(items);
        value = value.update('id', id => id || randomId());
        value = value.update('__typename', typename => typename || null);
        this.setState({
          canRender: false
        });
        fetch(keyName)
          .then(result => {
            return result.getIn([keyName, 'edges']).size;
          })
          .then(size => {
            request({
              type: 'CREATE_ARRAY',
              payload: {
                id: value.get('id'),
                value,
                key: keyName
              }
            }).then(() => {
              this.setState({
                canRender: true,
                refId: new RefId(`${keyName}/${size}`)
              });
            });
          });
      }

      if (!params.op && this.props.params.op === 'create' && pattern === 'array') {
        this.setState({
          refId: new RefId(keyName)
        });
      }
    }

    componentDidMount() {
      const {params, pattern, request, keyName, items, fetch} = this.props;
      if (params.op === 'create' && pattern === 'array') {
        let value = createEmptyData(items);
        value = value.update('id', id => id || randomId());
        value = value.update('__typename', typename => typename || null);
        fetch(keyName)
          .then(result => {
            return result.getIn([keyName, 'edges']).size;
          })
          .then(size => {
            request({
              type: 'CREATE_ARRAY',
              payload: {
                id: value.get('id'),
                value,
                key: keyName
              }
            }).then(() => {
              this.setState({
                canRender: true,
                refId: new RefId(`${keyName}/${size}`)
              });
            });
          });
      } else {
        this.setState({
          canRender: true
        });
      }
    }

    render() {
      let {canRender, refId} = this.state;
      if (!canRender) return null;
      return <Com {...this.props}
        refId={refId}
      />
    }
  };
}

function isChildrenOfArray(pattern: string) {
  const patternArray = pattern.split('.');
  return patternArray.length === 2 && patternArray[0] === 'array';
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}