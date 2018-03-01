// @flow
import {Map, List} from 'immutable';
import set from 'lodash/set';
import unset from 'lodash/unset';
import {findAndReplaceField} from '../../utils/replaceId';
import {UNIQUE_ID} from '../../config';

type mapResource = {
  [key: string]: Map<string, any>
}

type collectionResource = {
  [key: string]: Map<string, Map<string, any>>
}

export default class Resource {
  value: mapResource | collectionResource
  constructor() {
    this.value = {};
  }

  replace(re: {path: string, data: {from: string, to: string}}, isList: boolean) {
    const paths = re.path.split('/');
    const key = paths.shift();
    let value;
    if (isList) {
      value = this.getList(key);
    } else {
      value = this.get(key);
    }
    value = findAndReplaceField(value, paths, re.data);
    if (isList) {
      // $FlowFixMe
      this.setList(key, value);
    } else {
      // $FlowFixMe
      this.set(key, value);
    }
  }

  create(key: string, value: Map<string, any> | List<any>) {
    if (List.isList(value)) {
      this.setList(key, ((value: any): List<any>));
    } else {
      this.set(key, ((value: any): Map<string, any>));
    }
  }

  get(key: string) {
    return this.value[key];
  }

  getList(key: string, ids: ?List<string>): List<any> {
    if (!ids) {
      return this.value[key].toList();
    }
    return ids.map(key2 => {
      return this.value[key].get(key2);
    });
  }

  set(key: string, value: Map<string, any>) {
    set(this.value, key, value);
  }

  setList(key: string, value: List<any>) {
    set(this.value, key, value.reduce((map, item) => {
      return map.set(item.get(UNIQUE_ID), item);
    }, new Map()));
  }

  update(key: string, value: Map<string, any>) {
    this.set(key, value);
  }

  merge(key: string, value: Map<string, any>) {
    let originValue = this.get(key);
    originValue = originValue.merge(value);
    this.set(key, originValue);
  }

  mergeList(key: string, value: List<any>) {
    let map = value.reduce((map, item) => {
      return map.set(item.get(UNIQUE_ID), item);
    }, new Map());
    let originValue = this.get(key);
    originValue = originValue.merge(map);
    this.set(key, originValue);
  }

  delete(key: string) {
    unset(this.value, key);
  }

  deleteListItem(key: string, id: string) {
    this.value[key].delete(id);
  }

  has(key: string) {
    return key in this.value;
  }
}
