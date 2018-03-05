/**
 * @flow
 */

import Endpoint from '../endpoint';
import apiClient from '../utils/apiClient';

export default class CannerEndpoint extends Endpoint {
  constructor({appId, initToken}: {appId: string, initToken: string}) {
    super();
    // initialize singleton apiClient
    apiClient.setAppId(appId).setInitToken(initToken).connect();
  }

  getArray(key: string, query?: queryType) {
    if (query) {
      return apiClient.getInstance()
                    .array(key)
                    .find()
                    .where(query.filter || {})
                    .sort(query.sort || {})
                    .page(query.pagination && query.pagination.page)
                    .perPage(query.pagination && query.pagination.perPage)
                    .exec()
                    .then((data) => {
                      return data;
                    });
    }
    return apiClient.getInstance()
                    .array(key)
                    .find()
                    .exec();
  }

  createArray(key: string, data: {[string]: any}) {
    return apiClient.getInstance()
                    .array(key)
                    .create(data)
                    .exec();
  }

  updateArray(key: string, id: string, data: {[string]: any}) {
    return apiClient.getInstance()
                    .array(key)
                    .update(id, data)
                    .exec();
  }

  deleteArray(key: string, id: string) {
    return apiClient.getInstance()
                    .array(key)
                    .delete(id)
                    .exec();
  }

  getObject(key: string) {
    return apiClient.getInstance()
                    .object(key)
                    .get('/')
                    .exec();
  }

  updateObject(key: string, data: {[string]: any}) {
    return apiClient.getInstance()
                    .object(key)
                    .set('/', data)
                    .exec();
  }
}
