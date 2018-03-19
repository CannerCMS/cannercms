// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {Map, List} from 'immutable';
import isEqual from 'lodash/isEqual';
import {fetchFromRelation} from "./relationFactory";
import type {RelationDef} from "./relationFactory";
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';

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
  value: any,
  canRender: boolean
};

export default function relation(Com: React.ComponentType<*>) {
  return class ComponentWithRelation extends React.PureComponent<Props, State> {
    relationList: Array<{
      __key__: string,
      relation: RelationDef
    }>
    static contextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func
    };

    constructor(props: Props) {
      super(props);
      this.state = {
        value: null,
        canRender: false
      };
      this.relationList = props.items ? findFromItems(props.items, schema => {
        return schema.type === 'relation';
      }, ['relation', '__key__']) : [];
    }

    componentDidMount() {
      this.fetchRelationValue();
    }

    componentWillReceiveProps(nextProps: Props) {
      const {relation, ui, pattern} = nextProps;
      let thisValue = this.props.value;
      let nextValue = nextProps.value;
      thisValue = (thisValue && thisValue.toJS) ? thisValue.toJS() : thisValue;
      nextValue = (nextValue && nextValue.toJS) ? nextValue.toJS() : nextValue;
      console.log('-------------');
      console.log(nextValue.slice());
      console.log(thisValue.slice());
      console.log('-------------');
      if ((relation || ((ui === 'breadcrumb' || ui === 'popup') && pattern === 'array')) && !isEqual(thisValue, nextValue)) {
        // this.fetchRelationValue(nextProps, {start: 0, limit: 10});
      }
    }

    fetchRelationValue = (props?: Props, pagination?: {start: number, limit: number}): Promise<*> => {
      const {fetch} = this.context;
      const {items, name, id, rootValue, relation, value, ui, pattern} = props || this.props;
      if (relation) {
        return fetchFromRelation(id, relation, {
          entityId: getParentId(rootValue, id),
          fieldValue: (value && value.toJS) ? value.toJS() : value
        }, fetch, pagination || {start: 0, limit: 10}).then(data => {
          this.setState({
            value: data,
            canRender: true
          });
        });
      } else if ((ui === 'breadcrumb' || ui === 'popup') && pattern === 'array') {
        items.__key__ = name;
        return Promise.all(value.map(v => {
          return Promise.all(this.relationList.map(item => {
            const {relation, __key__} = item;
            const isOneToOne = relation.relationship.startsWith('oneToOne');
            const isManyToOne = relation.relationship.startsWith('manyToOne');
            let idList = [];
            if (relation.relationship === 'oneToMany.idMap') {
              idList = idList.concat((v.get(__key__) || new Map()).keySeq().toJS());
            } else {
              idList = idList.concat((v.get(__key__) || []));
            }
            const data = {
              entityId: getParentId(rootValue, id),
              fieldValue: isOneToOne || isManyToOne ? idList[0] : idList
            }
            return fetchFromRelation(id, relation, data, fetch, pagination || {start: 0, limit: 10})
              .then(data => ({
                __key__,
                data
              }));
          })).then(relationValues => {
            return relationValues.reduce((v, {__key__, data}) => v.set(__key__, data), v)
          });
        })).then(data => {
          this.setState({
            value: List(data),
            canRender: true
          });
        });
      }
      return Promise.resolve().then(() => {
        this.setState({
          value,
          canRender: true
        });
      });
    }

    render() {
      const {value, canRender} = this.state;
      if (!canRender)
        return null;
      return <Com {...this.props} fetchRelation={this.fetchRelationValue} value={value}/>;
    }
  };
}

function getParentId(value, id) {
  const idPath = id.split('/').slice(1);
  idPath[idPath.length - 1] = "_id";
  return value.getIn(idPath);
}

function findFromItems(items, filter, rtnField, list) {
  list = list || [];
  if (!isObject(items)) {
    return list;
  }
  if (items && filter(items)) {
    try {
      list.push(pick(items, rtnField));
    } catch (e) {
      list.push(items);
      // eslint-disable-next-line
      console.error(e);
    }
    return list;
  }

  if ('items' in items ) {
    list = list.concat(findFromItems(items.items, filter, rtnField));
  } else {
    list = Object.keys(items).reduce((acc, key) => {
      const item = items[key];
      if (isObject(item)) {
        item.__key__ = key;
        return acc.concat(findFromItems(item, filter, rtnField));
      }
      return acc;
    }, list);
  }
  return list;
}