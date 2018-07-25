// @flow

import * as React from 'react';
import {generateAction} from '../action';
import isArray from 'lodash/isArray';
import {createEmptyData} from 'canner-helpers';
import RefId from 'canner-ref-id';
import { List, Map } from 'immutable';

type RelationDef = any;

type Props = {
  value: any,
  rootValue: any,
  relation?: RelationDef,
  fetchRelation: () => Promise<*>,
  request: RequestDef,
  items: any,
  pattern: string
};

type changeQueue = Array<{RefId: RefId | {firstRefId: RefId, secondRefId: RefId}, type: any, value: any}>;

export default function withRequest(Com: React.ComponentType<*>) {
  // this hoc will update data;
  return class ComponentWithRequest extends React.Component<Props> {
    onChange = (refId: RefId | {firstRefId: RefId, secondRefId: RefId} | changeQueue, type: any, delta: any, config: any): Promise<*> => {
      let id;
      if (isArray(refId)) { // changeQueue
        const changeQueue = refId;
        // $FlowFixMe
        return Promise.all(changeQueue.map(args => {
          const {refId, type, value} = args;
          return this.onChange(refId, type, value);
        }));
      } else if (refId instanceof RefId) {
        id = refId.toString();
      } else {
        id = {
          // $FlowFixMe: refId should be object here
          firstId: refId.firstRefId.toString(),
          // $FlowFixMe: refId should be object here
          secondId: refId.secondRefId.toString()
        };
      } 
      const {rootValue, relation, request, items, pattern} = this.props;
      const action = createAction({
        relation,
        id,
        type,
        value: delta,
        config,
        rootValue,
        items,
        pattern
      });
      if (!action) {
        throw new Error('invalid change');
      }
      if (action.type === 'NOOP') {
        return Promise.resolve();
      }
      return request(action);
    }

    render() {
      return <Com {...this.props} onChange={this.onChange} />;
    }
  };
}

export function createAction({
  relation,
  id,
  type,
  value,
  config,
  rootValue,
  items,
}: { 
  relation: any,
  id: {firstId: string, secondId: string} | string,
  type: 'create' | 'update' | 'delete' | 'swap',
  value: any,
  config: any,
  rootValue: any,
  value: any,
  items: any
}) {
  if (type === 'create') {
    if (!config) {
      const emptyData = createEmptyData(items);
      
      if (emptyData.toJS) {
        value = emptyData.mergeDeep(value);
      } else {
        value = emptyData;
      }
    }
    // first layer array will gen id and typename by client, so we don;t have to do that
    // quick fix
    value = value.update('id', id => id || randomId());
  }
  value = addTypename(value)
  return generateAction({
    id,
    updateType: type,
    value,
    rootValue,
    relation
  });
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}

function addTypename(value) {
  if (Map.isMap(value)) {
    value = value.update('__typename', typename => typename || null);
    value = value.map(child => addTypename(child));
  } else if (List.isList(value)) {
    value = value.map(child => addTypename(child));
  }
  return value;
}