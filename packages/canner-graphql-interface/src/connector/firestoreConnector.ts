import { Connector, Pagination } from './types';
import mapValues from 'lodash/mapValues';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import * as firebase from 'firebase';
import { paginator, filter } from 'canner-graphql-utils';
import { Field, Types } from 'canner-graphql-utils/lib/schema/types';
import RelationField from 'canner-graphql-utils/lib/schema/relationField';

const snapToArray = snapshot => {
  const rows = [];
  snapshot.forEach(childSnapshot => {
    rows.push({
      id: childSnapshot.id,
      ...childSnapshot.data()
    });
  });
  return rows;
};

const recursiveMap = ({data, schema}: {data: any, schema: Field}) => {
  return mapValues(data, (val, key) => {
    const field = schema.getChild(key);
    const type = field.getType();
    if (type === Types.ARRAY) {
      if (isEmpty(val)) {
        return [];
      }
      if (!field.hasChild()) {
        return val;
      }
      return val.map(ele => recursiveMap({data: ele, schema: field}));
    }

    if (type === Types.OBJECT) {
      return recursiveMap({data: val, schema: field});
    }

    if (type === Types.RELATION && (field as RelationField).isToMany()) {
      if (isEmpty(val)) {
        return [];
      }
      return Object.keys(val);
    }
    return val;
  });
};

const recursivePayload = ({data, schema}: {data: any, schema: Field}) => {
  return mapValues(data, (val, key) => {
    const field = schema.getChild(key);
    const type = field.getType();
    if (type === Types.ARRAY) {
      if (isEmpty(val) || isEmpty(val.set)) {
        return [];
      }

      if (!field.hasChild()) {
        return val.set;
      }
      return val.set.map(ele => recursivePayload({data: ele, schema: field}));
    }

    if (type === Types.OBJECT) {
      return recursivePayload({data: val, schema: field});
    }

    if (type === Types.RELATION && (field as RelationField).isToMany()) {
      if (isEmpty(val)) {
        return {};
      }
      return reduce(val, (obj, id) => {
        obj[id] = true;
        return obj;
      }, {});
    }
    return val;
  });
};

export default class FirestoreConnector implements Connector {
  private database: firebase.firestore.Firestore;
  private auth: () => Promise<any>;

  constructor(
    {database, auth}:
    {database: firebase.firestore.Firestore, auth?: () => Promise<any>}) {
    this.database = database;
    this.auth = auth || this.anonymousLogin;
  }

  public async prepare() {
    return this.auth();
  }

  public async listResolveByUnique(
    { key, field, schema }:
    { key: string; field: { [key: string]: any; }; schema: Field}): Promise<any> {
    const snapshot = await this.database.doc(`${key}/${field.id}`).get();
    return snapshot.exists
      ? recursiveMap({
        data: {id: field.id, ...snapshot.data()},
        schema
      })
      : {};
  }

  public async hasNextPage({key, id}) {
    throw Error('Not Implemented');
  }

  public async listResolveQuery(
    { key, where, order, pagination, schema }:
    {
      key: string;
      where?: any;
      order?: any;
      pagination?: Pagination;
      schema?: Field
    }): Promise<any> {
      const snapshot = await this.database.collection(key).get();
      let rows = snapToArray(snapshot);
      rows = await this.join(rows, where);
      rows = filter({data: rows, where, order});
      const result = await paginator(rows, pagination);
      result.edges = result.edges.map(edge => {
        return {
          cursor: edge.cursor,
          node: recursiveMap({
            data: edge.node,
            schema
          })
        };
      });
      return result;
  }

  public async resolveToOne(
    { from, to, id, schema }: { from: string; to: string; id: string; schema: Field }): Promise<any> {
    return id ? this.listResolveByUnique({
      key: to,
      field: {id},
      schema
    }) : null;
  }

  public async resolveToMany(
    { from, to, ids, pagination, schema }:
    { from: string; to: string; ids: [string]; pagination: Pagination; schema: Field }): Promise<any> {
    const rows = ids ? await Promise.all(ids.map(id => {
      return this.listResolveByUnique({
        key: to,
        field: {id},
        schema
      });
    })) : [];
    return paginator(rows, pagination);
  }

  public async mapResolve(key: string, schema: Field): Promise<any> {
    const snapshot = await this.database.doc(`canner-object/${key}`).get();
    return recursiveMap({data: snapshot.data(), schema});
  }

  public async mapUpdate(key: string, payload: any, schema: Field): Promise<any> {
    payload = recursivePayload({data: payload, schema});
    try {
      await this.database.doc(`canner-object/${key}`).update(payload);
    } catch (e) {
      if (/No document to update/.test(e.message)) {
        await this.database.doc(`canner-object/${key}`).set(payload);
      } else {
        // throw other error
        throw e;
      }
    }
    return this.mapResolve(key, schema);
  }

  public async listCreate(key: string, payload: any, schema: Field): Promise<any> {
    payload = recursivePayload({data: payload, schema});
    const newRef = await this.database.collection(key).add(payload);
    return this.listResolveByUnique({key, field: {id: newRef.id}, schema});
  }

  public async listUpdate(key: string, where: any, payload: any, schema: Field): Promise<any> {
    payload = recursivePayload({data: payload, schema});
    await this.database.doc(`${key}/${where.id}`).update(payload);
    return this.listResolveByUnique({key, field: {id: where.id}, schema});
  }

  public async listDelete(key: string, where: any): Promise<any> {
    await this.database.doc(`${key}/${where.id}`).delete();
    return {id: where.id};
  }

  private async anonymousLogin() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          resolve();
        } else {
          // User is signed out.
        }
      });

      firebase.auth().signInAnonymously().catch(error => {
        reject(error);
      });
    });
  }

  private async join(rows, where) {
    const keys = [];
    const fields = {};
    if (isEmpty(where)) {
      return rows;
    }

    // if relation filter exist, then join data
    Object.keys(where).forEach(field => {
      if (where[field].schema
          && where[field].schema.getType() === Types.RELATION
          && where[field].schema.isToOne()
        ) {
        const to = where[field].schema.relationTo();
        keys.push(to);
        fields[field] = to;
      }
    });

    if (isEmpty(keys)) {
      return rows;
    }

    const joinedData = await Promise.all(keys.map(key => {
      return this.database.collection(key).get()
        .then(snapshot => {
          return {key, snapshot};
        });
    }));

    const dataMap: { [key: string]: firebase.firestore.QuerySnapshot } = reduce(
      joinedData, (map, {key, snapshot}) => {
      map[key] = snapshot;
      return map;
    }, {});

    return rows.map(row => {
      return {
        ...row,
        ...mapValues(fields, (to: string, field: string) => {
          let child: firebase.firestore.QueryDocumentSnapshot;
          dataMap[to].forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
            if (snapshot.id === row[field]) {
              child = snapshot;
            }
          });
          return {id: child.id, ...child.data()};
        })
      };
    });
  }
}
