/**
 * @flow
 */

import Endpoint from './index';
import values from 'lodash/values';
import mapValues from 'lodash/mapValues';
import Query from '../utils/query';
import isEmpty from 'lodash/isEmpty';

export default class FirebaseEndpoint extends Endpoint {
  constructor(config: any, firebase) {
    super();
    // initialize firebase
    // firebase 的 login 交給 qafrom container去做
    this.firebase = firebase;
    firebase.initializeApp(config);
  }

  generateUniqueId(key: string): string {
    return this.firebase.database().ref(key).push().key;
  }

  getArray(key: string, query: ?queryType) {
    let ref = this.firebase.database().ref(key);
    let sortKey = '';
    if (query && query.sort && !isEmpty(query.sort)) {
        // $FlowFixMe
      sortKey = Object.keys(query.sort).find(sortKey => {
        // $FlowFixMe
        return query.filter && sortKey in query.filter;
      });
      if (!sortKey) {
        // $FlowFixMe
        sortKey = Object.keys(query.sort)[0];
        ref = ref.orderByChild(sortKey.replace('.', '/'));
      }
    }
    if (query && query.filter && !isEmpty(query.filter)) {
      const filterKey = Object.keys(query.filter)[0];
      let filterCondition = query.filter[filterKey];
      if (sortKey in query.filter) {
        filterCondition = query.filter[sortKey];
      } else {
        ref = ref.orderByChild(filterKey.replace('.', '/'));
      }
      Object.keys(filterCondition).forEach(operator => {
        switch (operator) {
          case '$lte':
            ref = ref.endAt(filterCondition[operator]);
            break;
          case '$gte':
            ref = ref.startAt(filterCondition[operator]);
            break;
          case '$equal':
          case '$eq':
            ref = ref.equalTo(filterCondition[operator]);
            break;
          default:
            break;
        }
      });
    }

    return ref.once('value')
              .then(function(snapshot) {
                let result = snapshot.val();
                if (result === null) {
                  result = {};
                }
                result = mapValues(result, (val, key) => ({...val, _id: key}));
                return new Query({data: values(result)})
                  .sort(query ? query.sort : undefined)
                  .filter(query ? query.filter : undefined)
                  .page(Query.turnPage(query ? query.pagination : undefined))
                  .getData();
              });
  }

  createArray(key: string, data: {[string]: any}) {
    const newId = this.generateUniqueId(key);
    const oldId = data._id;
    const ref = this.firebase.database().ref(`${key}/${newId}`);
    data._id = newId;
    const replace = [{
      path: `${key}/_id`,
      data: {
        from: oldId,
        to: newId
      }
    }];
    return ref.set(data).then(() => replace);
  }

  updateArray(key: string, id: string, data: {[string]: any}) {
    return this.firebase.database()
                    .ref(key)
                    .child(id)
                    .set(data);
  }

  deleteArray(key: string, id: string) {
    return this.firebase.database()
                    .ref(key)
                    .child(id)
                    .remove();
  }

  getObject(key: string) {
    return this.firebase.database()
                    .ref(key)
                    .once('value')
                    .then(function(snapshot) {
                      const result = snapshot.val();
                      if (result === null) {
                        return {};
                      }
                      return result;
                    });
  }

  updateObject(key: string, data: {[string]: any}) {
    return this.firebase.database()
                    .ref(key)
                    .set(data);
  }
}
