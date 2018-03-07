// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {} from 'immutable';
import isEqual from 'lodash/isEqual';
import {fetchFromRelation} from "./relationFactory";
import type {RelationDef} from "./relationFactory";

type Props = {
  id: string,
  rootValue: any,
  isEntity: boolean,
  name: string,
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  [string]: any,
  relation: RelationDef
};

type State = {
  value: any
};

export default function relation(Com: React.ComponentType<*>) {
  return class ComponentWithRelation extends React.PureComponent<Props, State> {
    componentId: string;

    static contextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func
    };

    constructor(props: Props) {
      super(props);
      this.state = {
        value: null
      };
      this.componentId = props.id;
    }

    componentDidMount() {
      this.fetchRelationValue();
    }

    componentWillReceiveProps(nextProps: Props) {
      let thisValue = this.props.value;
      let nextValue = nextProps.value;
      thisValue = (thisValue && thisValue.toJS) ? thisValue.toJS() : thisValue;
      nextValue = (nextValue && nextValue.toJS) ? nextValue.toJS() : nextValue;
      if (!isEqual(thisValue, nextValue)) {
        this.fetchRelationValue(nextProps, {start: 0, limit: 10});
      }
    }

    fetchRelationValue = (props?: Props, pagination?: {start: number, limit: number}) => {
      const {fetch} = this.context;
      const {relation, value, rootValue} = props || this.props;
      const id = this.componentId;
      const data = {
        entityId: getParentId(rootValue, id),
        fieldValue: (value && value.toJS) ? value.toJS() : value
      };
      return fetchFromRelation(id, relation, data, fetch, pagination || {start: 0, limit: 10})
        .then(responseData => {
          this.setState({
            value: responseData
          });
        });
    }

    render() {
      const {value} = this.state;
      return <Com {...this.props} fetchRelation={this.fetchRelationValue} value={value}/>;
    }
  };
}

function getParentId(value, id) {
  const idPath = id.split('/').slice(1);
  idPath[idPath.length - 1] = "_id";
  return value.getIn(idPath);
}