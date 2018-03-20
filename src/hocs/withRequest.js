// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {generateAction} from '../app';
import isArray from 'lodash/isArray';
import type {RelationDef} from "./relationFactory";
import {create} from "./relationFactory";

type Props = {
  id: string,
  value: any,
  rootValue: any,
  relation?: RelationDef,
  fetchRelation: () => Promise<*>
};

type changeQueue = Array<{id: string | {firstId: string, secondId: string}, type: any, value: any}>;

export default function withRequest(Com: React.ComponentType<*>) {
  // this hoc will update data;
  // it's the onChange end
  return class ComponentWithRequest extends React.Component<Props> {
    static contextTypes = {
      request: PropTypes.func
    };

    onChange = (id: string | {firstId: string, secondId: string} | changeQueue, type: any, delta: any) => {
      if (isArray(id)) {
        const changeQueue = id;
        // $FlowFixMe
        return Promise.all(changeQueue.map(args => {
          const {id, type, value} = args;
          return this.onChange(id, type, value);
        }));
      }
      const {request} = this.context;
      const {rootValue, relation, value} = this.props;
      // generate action
      // $FlowFixMe: id sould string here
      const action = createAction(relation, id, type, delta, rootValue, value);
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

export function createAction(relation: any, id: string, type: 'create' | 'update' | 'delete' | 'swap', delta: any, rootValue: any, value: any) {
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