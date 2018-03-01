/**
 * @flow
 */

import Action from './action';
import {fromJS} from 'immutable';
import {UNIQUE_ID} from '../config';
import {isUndefined, flatten} from 'lodash';
import type Endpoint from '../endpoint';
import type {List} from 'immutable';

type Collection = List<any>

type actionArgs = {
  name: string,
  id: string,
  data: any,
  path: Array<string>,
  mutation: ?Collection => Collection,
  endpoint: Endpoint,
  collection: Collection
}

type mutaionArgs = {
  collection: Collection,
  index: number,
  path: Array<string>,
  data: any
}
export default class CollectionUpdate extends Action {
  name: string
  id: string
  data: any
  path: Array<string>
  mutation: ?Collection => Collection
  endpoint: Endpoint
  cachedData: MapType<any, any>

  // eslint-disable-next-line max-len
  constructor({name, id, data, path = [], mutation, endpoint}: actionArgs) {
    super();
    this.name = name;
    this.id = id;
    this.mutation = mutation;
    this.path = path;
    this.endpoint = endpoint;
    this.data = data;
    // data could be any type, so we need to initialize data
    // so in apicall we could serve with this data
    // making PUT /posts/0, data
    this.cachedData = null;
  }

  getUpdateMutation(): Collection {
    return (this.mutation) ?
// $FlowFixMe
      this.mutation :
// $FlowFixMe
      this.defaultUpdateMutation;
  }

  // eslint-disable-next-line max-len
  defaultUpdateMutation({collection, index, path, data}: mutaionArgs): Collection {
    // undefined value will not be sent in fetch
    // JSON.stringify will make it disappear\
    // eslint-disable-next-line
    // TODO: find a good way
    if (isUndefined(data)) {
      data = null;
    }
    return (collection.setIn(flatten([index, path]), fromJS(data)): any);
  }

  callApi() {
    return this.endpoint
            .updateArray(this.name, this.id, this.cachedData.toJS());
  }

  mutate(collection: Collection) {
    const index = collection.findIndex(i => i.get(UNIQUE_ID) === this.id);
    if (index >= 0) {
      const mutation = this.getUpdateMutation();
// $FlowFixMe
      collection = mutation({
        collection,
        index,
        path: this.path,
        data: this.data
      });
      this.cachedData = collection.get(index);
    }
    return collection;
  }
}
