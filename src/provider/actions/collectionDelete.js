/**
 * @flow
 */

import Action from './action';
import {UNIQUE_ID} from '../config';
import type Endpoint from '../endpoint';
import type {List as Collection} from 'immutable';

type ActionArgs = {
  name: string,
  id: string,
  endpoint: Endpoint
}

export default class CollectionDelete extends Action {
  name: string
  id: string
  endpoint: Endpoint

  constructor({name, id, endpoint}: ActionArgs) {
    super();
    this.name = name;
    this.id = id;
    this.endpoint = endpoint;
  }

  callApi() {
    return this.endpoint.deleteArray(this.name, this.id);
  }

  mutate(collection: Collection<any>) {
    const index = collection
                  .findIndex((i) => i.get(UNIQUE_ID) === this.id);
    if (index >= 0) {
      collection = collection.delete(index);
    }
    return collection;
  }
}
