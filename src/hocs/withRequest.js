// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {generateAction} from '../provider';
import isArray from 'lodash/isArray';
import type {RelationDef} from "./relationFactory";
import {create} from "./relationFactory";

type Props = {
  id: string,
  isEntity: boolean,
  name: string,
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  [string]: any,
  rootValue: any,
  relation?: RelationDef
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
        changeQueue.forEach(args => {
          const {id, type, value} = args;
          this.onChange(id, type, value);
        });
        return;
      }
      const {request} = this.context;
      const {rootValue, relation, value} = this.props;
      // generate action
      const action = createAction(relation, id, type, delta, rootValue, value);
      if (!action) {
        return;
      }

      // quick and temp solution
      if (relation && (relation.relationship === 'oneToMany.foreignKey' || relation.relationship === 'manyToMany.foreignKeyMap')) {
        return request(action).then(() => this.props.fetchRelation());
      }
      return request(action);
    }

    render() {
      // default onChange function is pass by this hoc not parent
      // but in some situation maybe parent plugin want control the data like popup modal.
      const {onChange} = this.props;
      return <Com {...this.props} onChange={onChange || this.onChange} />;
    }
  };
}

function createAction(relation, id, type, delta, rootValue, value) {
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