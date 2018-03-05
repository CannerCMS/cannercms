/**
 * @flow
 */

import Action from './action';
import {UNIQUE_ID} from '../config';
import type Endpoint from '../endpoint';
import type {List as Collection} from 'immutable';

type ActionArgs = {
  name: string,
  data: any,
  endpoint: Endpoint
}

export default class CollectionCreate extends Action {
  name: string
  data: any
  endpoint: Endpoint

  constructor({name, data, endpoint}: ActionArgs) {
    super();
    this.name = name;
    this.data = data.set(UNIQUE_ID, endpoint.generateUniqueId());
    this.endpoint = endpoint;
  }

  callApi() {
    return this.endpoint.createArray(this.name, this.data.toJS());
  }

  mutate(collection: Collection<any>) {
    return collection.push(this.data);
  }
}
