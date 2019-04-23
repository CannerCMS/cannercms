// @flow

// $FlowFixMe: unresolved
import {fromJS} from 'immutable';
import RefId from 'canner-ref-id';

export type UpdateType = 'update' | 'create' | 'delete';
export type SwapType = 'swap';

export type onChangeFunc =  ((path: RefId, type: UpdateType, delta: *) => void) &
  ((path: {firstRefId: RefId, secondRefId: RefId}, type: SwapType) => void);

class Store {
  // eslint-disable-next-line
  subcriber = (value: *) => {};
  value = fromJS({});

  getValue = () => {
    return this.value;
  }

  listen(subcriber: (value: *) => void) {
    this.subcriber = subcriber;
  }

  push() {
    this.subcriber(this.value);
  }

  setValue = (value: *) => {
    this.value = fromJS(value);
    this.push();
  }

  getValueByPath = (path: RefId) => {
    const pathArr = path.getPathArr();
    return this.value.getIn(pathArr);
  }

  setValueByPath = (path: RefId, value: *) => {
    const pathArr = path.getPathArr();
    this.value = this.value.setIn(pathArr, fromJS(value));
    this.push();
  }

  // $FlowFixMe: flow can't work pretty on function overloading , so using any to temp resolve
  onChange: onChangeFunc = (path: any, type, delta: any) => {
    switch(type) {
      case 'update': {
        this.setValueByPath(path, delta);
        break;
      }
      case 'create': {
        let collection = this.getValueByPath(path);
        if (isEntry(path)) {
          delta = delta.set('_id', getRandomString());
        }
        collection = collection.push(delta);
        this.setValueByPath(path, collection);
        break;
      }
      case 'delete': {
        let collection = this.getValueByPath(path.remove());
        const pathArr = path.getPathArr();
        const index = pathArr[pathArr.length - 1];
        collection = collection.remove(index);
        this.setValueByPath(path.remove(), collection);
        break;
      }
      case 'swap': {
        const {firstRefId, secondRefId} = path;
        const collection = this.getValueByPath(firstRefId.remove());
        const firstRefIdArr = firstRefId.getPathArr();
        const secondRefIdArr = secondRefId.getPathArr();
        const firstIndex = firstRefIdArr[firstRefIdArr.length - 1];
        const secondIndex = secondRefIdArr[secondRefIdArr.length - 1];
        let newCollection = collection.set(firstIndex, collection.get(secondIndex));
        newCollection = newCollection.set(secondIndex, collection.get(firstIndex));
        this.setValueByPath(firstRefId.remove(), newCollection);
        break;
      }
      default:
        break;
    }
  }
}

function isEntry(path: RefId) {
  return path.getPathArr.length === 1;
}

function getRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

export default new Store();