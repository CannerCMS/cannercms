// @flow

import {set, unset, get} from 'lodash';

export class OnDeployManager {
  _map: {
    [string]: {
      [string]: Function
    }
  };
  _map = {}
  execute = ({
    key,
    value
  }: {
    key: string,
    value: any
  }): any => {
    const callbacks = this.findCallback(key);
    // console.log(value, callbacks, callbacks.reduce((result, callback) => callback(result), value));
    return callbacks.reduce((result, callback) => callback(result), value);
  }

  findCallback = (key: string): Array<any> => {
    return Object.values(get(this._map, [key], {}));
  }

  registerCallback = (key: string, callback: Function) => {
    const callbackId = randomStr();
    set(this._map, [key, callbackId], callback);
    return callbackId;
  }

  unregisterCallback = (key: string, callbackId: ?string) => {
    unset(this._map, [key, callbackId]);
  }
}

function randomStr() {
  return Math.random().toString(36).substr(2, 6);
}