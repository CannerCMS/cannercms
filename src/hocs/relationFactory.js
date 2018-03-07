// @flow

import keys from "lodash/keys";
import {List, Map} from "immutable";

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

type ManyToManyForeignKeyMapRelationDef = {
  relationship: "manyToMany.foreignKeyMap",
  relationTo: string,
  foreignKey: string,
  pickOne?: string
};

type Data<V> = {
  entityId: string,
  fieldValue: V
};

export type RelationDef = OneRelationDef |
  OneToManyForeignKeyRelationDef |
  OneToManyIdMapRelationDef |
  OneToManyIdListRelationDef |
  ManyToManyForeignKeyMapRelationDef;

type Fetch = (key: string, componentId: string, query?: Object, mutate?: Mutate) => Promise<any>;

type Relation<E, R> = (relation: R) => ({
  fetch: (fetch: Fetch, id: string, data: Data<E>, pagination: {start: number, limit: number}) => Promise<any>,
  transformValue?: (value: any) => any,
  // id of createAction might be string, {firstId, secondId}, or changeQueue
  createAction?: (id: any, type: 'create' | 'update' | 'delete' | 'swap', delta: any, rootValue: any, relationValue: any) => any
});

const UNIQUE_ID = "_id";

const toOne: Relation<string, OneRelationDef> = relation => {
  return {
    fetch: (fetch, id, data) => fetch(relation.relationTo, id, {filter: {_id: {$eq: data.fieldValue}}})
  };
};

const oneToManyForeignKey: Relation<string, OneToManyForeignKeyRelationDef> = relation => {
  return {
    fetch: (fetch, id, data, pagination: {start: number, limit: number}) => {
      return fetch(relation.relationTo, id, {filter: {[relation.foreignKey]: {$eq: data.entityId}}, pagination}, function(list, action, defaultMutate) {
        // $FlowFixMe
        const recordIndex = list.findIndex(item => item.get('_id') === action.payload.value.get('_id'));
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
            return defaultMutate ? defaultMutate(list, action) : list;
        }
      });
    },
    createAction: (id, type, delta, rootValue, relationValue) => {
      // you cant swap data come from foreign key
      // also no direct update to whole relation field
      if (type === "swap" || type === "update") {
        return {
          type: "NOOP"
        };
      }

      // create would be transform to => update foreignKey=this._id on foreign table
      // type=create id=articles/0/authors delta={_id: author_id, ...otherData}
      if (type === "create") {
        const paths = id.split("/");
        // get the index at 2nd position
        const index = paths[1];
        const recordId = rootValue.getIn([index, UNIQUE_ID]);
        return {
          type: "UPDATE_ARRAY",
          payload: {
            key: relation.relationTo,
            id: delta.get('_id'),
            path: relation.foreignKey,
            value: recordId
          }
        };
      }

      // delete would be transform to => update foreignKey="" on foreign table
      // type=delete id=articles/0/authors/0
      if (type === "delete") {
        const deletePaths = id.split("/");
        const index = deletePaths.pop();
        const deleteId = relationValue.getIn([index, UNIQUE_ID]);
        return {
          type: "UPDATE_ARRAY",
          payload: {
            key: relation.relationTo,
            id: deleteId,
            path: relation.foreignKey,
            value: null
          }
        };
      }

      throw new Error(`unsupported type ${type}`);
    }
  };
};

const oneToManyIdMap: Relation<string, OneToManyIdMapRelationDef> = relation => {
  return {
    fetch: (fetch, id, data, pagination: {start: number, limit: number}) => {
      const ids = keys(data.fieldValue);
      return fetch(relation.relationTo, id, {filter: {_id: {$in: ids}}, pagination});
    },
    createAction: (id, type, delta, rootValue, relationValue) => {
      if (type === "swap" || type === "update") {
        return {
          type: "NOOP"
        };
      }
      const paths = id.split('/');
      const {pickOne} = relation;
      if (List.isList(rootValue)) {
        if (type === 'delete') {
          const relationIndex = Number(paths.slice(-1)[0]);
          const newValue = relationValue.remove(relationIndex)
            .reduce((a, b) => a.set(b.get(UNIQUE_ID), b.get(pickOne) || true), new Map());
          return {
            type: "UPDATE_ARRAY",
            payload: {
              key: paths[0],
              id: rootValue.getIn([paths[1], UNIQUE_ID]),
              path: paths.slice(2, -1).join('/'),
              value: newValue
            }
          };
        }
        if (type === 'create') {
          return {
            type: "UPDATE_ARRAY",
            payload: {
              key: paths[0],
              id: rootValue.getIn([paths[1], UNIQUE_ID]),
              path: String(paths.slice(2)) + "/" + String(delta.get('_id')),
              value: pickOne ? delta.get(pickOne) : true
            }
          };
        }
      }
      if (type === 'delete') {
        const relationIndex = Number(paths.slice(-1)[0]);
        const newValue = relationValue.remove(relationIndex)
          .reduce((a, b) => a.set(b.get(UNIQUE_ID), b.get(pickOne) || true), new Map());
        return {
          type: "UPDATE_ARRAY",
          payload: {
            key: paths[0],
            path: paths.slice(1, -1).join('/'),
            value: newValue
          }
        };
      }
      if (type === 'create') {
        return {
          type: "UPDATE_OBJECT",
          payload: {
            key: paths[0],
            path: `${paths.slice(1)}/${delta.get('_id')}`,
            value: pickOne ? delta.get(pickOne) : true
          }
        };
      }
    }
  };
};

const oneToManyIdList: Relation<string, OneToManyIdListRelationDef> = relation => {
  return {
    fetch: (fetch, id, data, pagination: {start: number, limit: number}) => {
      return fetch(relation.relationTo, id, {filter: {_id: {$in: data.fieldValue || []}}, pagination});
    },
    transformValue: delta => {
      return delta && delta.get('_id');
    }
  };
};

const manyToManyForeignKeyMap: Relation<string, ManyToManyForeignKeyMapRelationDef> = relation => {
  return {
    fetch: (fetch, id, data, pagination: {start: number, limit: number}) => {
      // filter: {[`${relation.foreignKey}.${data.entityId}`]: {$eq: true}}
      return fetch(relation.relationTo, id, {filter: {[`${relation.foreignKey}/${data.entityId}`]: {$eq: true}}, pagination}, function(list, action, defaultMutate) {
        // $FlowFixMe
        const recordIndex = list.findIndex(item => item.get('_id') === action.payload.value.get('_id'));
        switch (action.type) {
          case 'UPDATE_ARRAY': {
            if (recordIndex === -1) {
              // can't find the record, but want update it
              if (action.payload.value.getIn([relation.foreignKey, data.entityId])) {
                // not in list, should add it
                list = list.push(action.payload.value);
              }
            } else if (!action.payload.value.getIn([relation.foreignKey, data.entityId])) {
              // want update the record with canceling the relation, so delete it
              list = list.delete(recordIndex);
            }
            return list;
          }
          default:
            return defaultMutate ? defaultMutate(list, action) : list;
        }
      });
    },
    createAction: (id, type, delta, rootValue, relationValue) => {
      // you cant swap data come from foreign key
      // also no direct update to whole relation field
      if (type === "swap" || type === "update") {
        return {
          type: "NOOP"
        };
      }
      // create would be transform to => update foreignKey=this._id on foreign table
      // type=create id=articles/0/authors delta={_id: author_id, ...otherData}
      if (type === "create") {
        const paths = id.split("/");
        // get the index at 2nd position
        const index = paths[1];
        const recordId = rootValue.getIn([index, UNIQUE_ID]);
        return {
          type: "UPDATE_ARRAY",
          payload: {
            key: relation.relationTo,
            id: delta.get('_id'),
            path: `${relation.foreignKey}/${recordId}`,
            value: true
          }
        };
      }

      // delete would be transform to => update foreignKey="" on foreign table
      // type=delete id=articles/0/authors/0
      if (type === "delete") {
        const relationIndex = id.split("/")[3];
        const recordIndex = id.split("/")[1];
        const relationId = relationValue.getIn([relationIndex, UNIQUE_ID]);
        const recordId = rootValue.getIn([recordIndex, UNIQUE_ID]);
        let relationForiegnItem = relationValue.getIn([relationIndex, relation.foreignKey]);
        relationForiegnItem = relationForiegnItem.remove(recordId);
        return {
          type: "UPDATE_ARRAY",
          payload: {
            key: relation.relationTo,
            id: relationId,
            path: `${relation.foreignKey}`,
            value: relationForiegnItem
          }
        };
      }

      throw new Error(`unsupported type ${type}`);
    }
  };
};

export const create = (relationDef: RelationDef) => {
  switch (relationDef.relationship) {
    case "oneToOne":
    case "manyToOne":
      return toOne(relationDef);

    case "oneToMany.foreignKey":
      return oneToManyForeignKey(relationDef);

    case "oneToMany.idMap":
      return oneToManyIdMap(relationDef);

    case "oneToMany.idList":
      return oneToManyIdList(relationDef);

    case "manyToMany.foreignKeyMap":
      return manyToManyForeignKeyMap(relationDef);

    default:
      throw new Error(`not supported relation ${relationDef.relationship}`);
  }
};

export const fetchFromRelation = (id: string, relationDef: RelationDef, data: Data<any>, fetch: Fetch, pagination: {start: number, limit: number}): Promise<any> => {
  const relation = create(relationDef);
  return relation.fetch(fetch, id, data, pagination)
    .then(ctx => ctx.response.body);
  // return ctx.response.data;
};