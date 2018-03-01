/**
 * @flow
 */

import createEmptyData from '@canner/qa-generator/lib/utils/createEmptyData';
import Endpoint from './index';
import {UNIQUE_ID} from '../config';
import store from 'store';
import Query from '../utils/query';
export const LOCAL_STORAGE_NAME = 'cannerQaDemo';

export default class LocalStorageEndpoint extends Endpoint {
  schema: {[string]: any}
  constructor({schema}: {schema: {[string]: any}}) {
    super();
    this.schema = schema;
  }

  getArray(key: string, conditions?: queryType): Promise<any> {
    let cannerJSON = this._getLocalStorage();
    return new Promise(resolve => {
      const arrayData = this._getData(cannerJSON, key);
      const queryedData = new Query({data: arrayData})
        .sort(conditions ? conditions.sort : undefined)
        .filter(conditions ? conditions.filter : undefined)
        .page(Query.turnPage(conditions ? conditions.pagination : undefined))
        .getData();
      resolve(queryedData);
    });
  }

  createArray(key: string, data: {[string]: any}): Promise<any> {
    let cannerJSON = this._getLocalStorage();
    return new Promise(resolve => {
      const arrayData = this._getData(cannerJSON, key);
      arrayData.push(data);
      cannerJSON[key] = arrayData;
      this._saveLocalStorage(cannerJSON);
      resolve([]);
    });
  }

  updateArray(key: string, id: string, data: {[string]: any}): Promise<any> {
    let cannerJSON = this._getLocalStorage();
    return new Promise(resolve => {
      let arrayData = this._getData(cannerJSON, key);
      arrayData = arrayData.map(item => {
        if (item[UNIQUE_ID] === id) {
          return {[UNIQUE_ID]: id, ...data};
        }
        return item;
      });
      cannerJSON[key] = arrayData;
      this._saveLocalStorage(cannerJSON);
      resolve(arrayData);
    });
  }

  deleteArray(key: string, id: string): Promise<any> {
    let cannerJSON = this._getLocalStorage();
    return new Promise(resolve => {
      let arrayData = this._getData(cannerJSON, key);
      arrayData = arrayData.filter(item => {
        return item[UNIQUE_ID] !== id;
      });
      cannerJSON[key] = arrayData;
      this._saveLocalStorage(cannerJSON);
      resolve(arrayData);
    });
  }

  getObject(key: string): Promise<any> {
    let cannerJSON = this._getLocalStorage();
    return new Promise(resolve => {
      const objData = this._getData(cannerJSON, key);
      resolve(objData);
    });
  }

  updateObject(key: string, data: {[string]: any}): Promise<any> {
    let cannerJSON = this._getLocalStorage();
    return new Promise(resolve => {
      cannerJSON[key] = data;
      this._saveLocalStorage(cannerJSON);
      resolve(cannerJSON);
    });
  }

  _getLocalStorage(): {[string]: any} {
    if (!store.get(LOCAL_STORAGE_NAME)) {
      const cannerJSON = createEmptyData(this.schema);
      this._saveLocalStorage(cannerJSON);
    }
    return store.get(LOCAL_STORAGE_NAME);
  }

  _saveLocalStorage(data: any) {
    store.set(LOCAL_STORAGE_NAME, data);
  }

  /**
   * _getData key: 如果這個array尚未存在，則依據其schema init
   * @param  {object} cannerJSON [data]
   * @param  {string} key        [get key]
   * @return {object}            [get data result]
   */
  _getData(cannerJSON: any, key: string): any {
    if (!cannerJSON || !cannerJSON[key]) {
      cannerJSON = createEmptyData(this.schema[key]);
    } else {
      cannerJSON = cannerJSON[key];
    }
    return cannerJSON;
  }
}
