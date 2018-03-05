// @flow
import keys from 'lodash/keys';
import {List} from 'immutable';

type OneRelationDef = {
  relationship: "oneToOne" | "manyToOne",
  relationTo: string
};

type OneToManyForeignKeyRelationDef = {
  relationship: "oneToMany.foreignKey",
  relationTo: string,
  foreignKey: string
};

type OneToManyIdMapRelationDef = {
  relationship: "oneToMany.idMap",
  relationTo: string,
  pickOne?: string
}
type OneToManyIdListRelationDef = {
  relationship: "oneToMany.idList",
  relationTo: string
}

type Data<V> = {
  entityId: string,
  fieldValue: V
};

export type RelationDef = OneRelationDef | OneToManyForeignKeyRelationDef | OneToManyIdMapRelationDef | OneToManyIdListRelationDef;

type Fetch = (key: string, componentId: string, query?: Object) => Promise<any>;

type Relation<E, R> = (relation: R) => ({
  fetch: (fetch: Fetch, id: string, data: Data<E>) => Promise<any>,
  transformValue?: (value: any) => any,
  // id of createAction might be string, {firstId, secondId}, or changeQueue
  createAction?: (id: any, type: 'create' | 'update' | 'delete' | 'swap', delta: any, rootValue: any) => any
});

const UNIQUE_ID = '_id';

const toOne: Relation<string, OneRelationDef> = (relation) => {
  return {
    fetch: (fetch, id, data) => fetch(relation.relationTo, id, {filter: {_id: {$eq: data.fieldValue}}}),
  };
};

const oneToManyForeignKey: Relation<string, OneToManyForeignKeyRelationDef> = (relation) => {
  return {
    fetch: (fetch, id, data) => {
      return fetch(relation.relationTo, id, {filter: {[relation.foreignKey]: {$eq: data.entityId}}}, function(list, action, defaultMutate) {
        const recordIndex = list.findIndex((item) => item.get('_id') === action.payload.value.get('_id'));
        switch (action.type) {
          case 'UPDATE_ARRAY': {
            if (recordIndex === -1) {
              // can't find the record, but want update it
              if (action.payload.value.get(relation.foreignKey) === data.entityId) {
                // not in list, should add it
                list = list.push(action.payload.value);
              }
            } else if (action.payload.value.get(relation.foreignKey) !== data.entityId) {
              // want update the record with canceling the relation, so delete it
              list = list.delete(recordIndex);
            }
            return list;
          }
          default:
            return defaultMutate(list, action);
        }
      });
    },
    createAction: (id, type, delta, rootValue) => {
      // you cant swap data come from foreign key
      // also no direct update to whole relation field
      if (type === 'swap' || type === 'update') {
        return {
          type: 'NOOP',
        };
      }

      // create would be transform to => update foreignKey=this._id on foreign table
      // type=create id=articles/0/authors delta={_id: author_id, ...otherData}
      if (type === 'create') {
        const paths = id.split('/');
        // get the index at 2nd position
        const index = paths[1];
        const recordId = rootValue.getIn([index, UNIQUE_ID]);
        return {
          type: 'UPDATE_ARRAY',
          payload: {
            key: relation.relationTo,
            id: delta.get('_id'),
            path: relation.foreignKey,
            value: recordId,
          },
        };
      }

      // delete would be transform to => update foreignKey="" on foreign table
      // type=delete id=articles/0/authors/0
      if (type === 'delete') {
        const deletePaths = id.split('/');
        const index = deletePaths.pop();
        const deleteId = rootValue.getIn([index, UNIQUE_ID]);
        return {
          type: 'UPDATE_ARRAY',
          payload: {
            key: relation.relationTo,
            id: deleteId,
            path: relation.foreignKey,
            value: null,
          },
        };
      }

      throw new Error(`unsupported type ${type}`);
    },
  };
};

const oneToManyIdMap: Relation<string, OneToManyIdMapRelationDef> = (relation) => {
  return {
    fetch: (fetch, id, data) => {
      const ids = keys(data.fieldValue);
      return fetch(relation.relationTo, id, {filter: {_id: {$in: ids}}});
    },
    createAction: (id, type, delta, rootValue) => {
      if (type === 'swap' || type === 'update') {
        return {
          type: 'NOOP',
        };
      }
      const paths = id.split('/');
      const {pickOne} = relation;
      if (List.isList(rootValue)) {
        return {
          type: 'UPDATE_ARRAY',
          payload: {
            key: paths[0],
            id: rootValue.getIn([paths[1], UNIQUE_ID]),
            path: `${paths.slice(2)}/${delta.get('_id')}`,
            value: pickOne ? delta.get(pickOne) : true,
          },
        };
      }
      return {
        type: 'UPDATE_OBJECT',
        payload: {
          key: paths[0],
          path: `${paths.slice(1)}/${delta.get('_id')}`,
          value: pickOne ? delta.get(pickOne) : true,
        },
      };
    },
  };
};

const oneToManyIdList: Relation<string, OneToManyIdListRelationDef> = (relation) => {
  return {
    fetch: (fetch, id, data) => {
      return fetch(relation.relationTo, id, {filter: {_id: {$in: data.fieldValue || []}}});
    },
    transformValue: (delta) => {
      return delta && delta.get('_id');
    },
  };
};

export const create = (relationDef: RelationDef) => {
  switch (relationDef.relationship) {
    case 'oneToOne':
    case 'manyToOne':
      return toOne(relationDef);

    case 'oneToMany.foreignKey':
      return oneToManyForeignKey(relationDef);

    case 'oneToMany.idMap':
      return oneToManyIdMap(relationDef);

    case 'oneToMany.idList':
      return oneToManyIdList(relationDef);

    default:
      throw new Error(`not supported relation ${relationDef.relationship}`);
  }
};

export const fetchFromRelation = (id: string, relationDef: RelationDef, data: Data<any>, fetch: Fetch): Promise<any> => {
  const relation = create(relationDef);
  return relation.fetch(fetch, id, data)
    .then((ctx) => ctx.response.body);
  // return ctx.response.data;
};
