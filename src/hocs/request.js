// @flow

import * as React from 'react';
import {generateAction} from '../action';
import isArray from 'lodash/isArray';
import {createEmptyData} from '@canner/react-cms-helpers';
import RefId from 'canner-ref-id';

type RelationDef = any;

type Props = {
  value: any,
  rootValue: any,
  relation?: RelationDef,
  fetchRelation: () => Promise<*>,
  request: RequestDef,
  items: any
};

type changeQueue = Array<{RefId: RefId | {firstRefId: RefId, secondRefId: RefId}, type: any, value: any}>;

export default function withRequest(Com: React.ComponentType<*>) {
  // this hoc will update data;
  return class ComponentWithRequest extends React.Component<Props> {
    onChange = (refId: RefId | {firstRefId: RefId, secondRefId: RefId} | changeQueue, type: any, delta: any, config: any) => {
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
      const {rootValue, relation, request, items} = this.props;
      // generate action
      const action = createAction({
        relation,
        id,
        type,
        value: delta,
        config,
        rootValue,
        items
      });
      if (!action) {
        throw new Error('invalid change');
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
  items
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
      // $FlowFixMe: createEMprtData return should more precise
      if (emptyData.toJS) {
      // $FlowFixMe: createEMprtData return should more precise
        value = emptyData.mergeDeep(value);
      } else {
        value = emptyData;
      }
    }
  }
  return generateAction({
    id,
    updateType: type,
    value,
    rootValue,
    relation
  });
}