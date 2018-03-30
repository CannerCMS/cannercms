// @flow

import * as React from 'react';
import {generateAction} from '../app';
import isArray from 'lodash/isArray';
import type {RelationDef} from "./relationFactory";
import {create} from "./relationFactory";
import createEmptyData from '../app/utils/createEmptyData';

type Props = {
  id: string,
  value: any,
  rootValue: any,
  relation?: RelationDef,
  fetchRelation: () => Promise<*>,
  request: RequestDef,
  items: any
};

type changeQueue = Array<{id: string | {firstId: string, secondId: string}, type: any, value: any}>;

export default function withRequest(Com: React.ComponentType<*>) {
  // this hoc will update data;
  // it's the onChange end
  return class ComponentWithRequest extends React.Component<Props> {
    onChange = (id: string | {firstId: string, secondId: string} | changeQueue, type: any, delta: any, config: any) => {
      if (isArray(id)) { // changeQueue
        const changeQueue = id;
        // $FlowFixMe
        return Promise.all(changeQueue.map(args => {
          const {id, type, value} = args;
          return this.onChange(id, type, value);
        }));
      }
      const {rootValue, relation, value, request, items} = this.props;
      // generate action
      // $FlowFixMe: id sould string here
      const action = createAction({
        relation,
        id,
        type,
        delta,
        config,
        rootValue,
        value,
        items
      });
      if (!action) {
        throw new Error('invalid change');
      }

      // quick and temp solution
      if (relation && (relation.relationship === 'oneToMany.foreignKey' || relation.relationship === 'manyToMany.foreignKeyMap')) {
        return request(action).then(() => this.props.fetchRelation());
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
  delta,
  config,
  rootValue,
  value,
  items
}: { 
  relation: any,
  id: string,
  type: 'create' | 'update' | 'delete' | 'swap',
  delta: any,
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
        delta = emptyData.mergeDeep(delta);
      } else {
        delta = emptyData;
      }
    }
  }
  const defaultReturn = () => generateAction(id, type, delta, rootValue);
  if (!relation) {
    return defaultReturn();
  }

  const relationInstance = create(relation);
  if (relation.relationship === 'oneToMany.foreignKey' || relation.relationship === 'manyToMany.foreignKeyMap' && type === 'delete') {
    // give the correct rootValue
    // rootValue = value;
  }

  if (relationInstance.transformValue) {
    return generateAction(id, type, relationInstance.transformValue(delta), rootValue);
  }

  if (relationInstance.createAction) {
    return relationInstance.createAction(id, type, delta, rootValue, value);
  }

  // default return
  return defaultReturn();
}