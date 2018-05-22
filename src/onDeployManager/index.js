// @flow

import {set, unset, get} from 'lodash';

export class OnDeployManager {
  _map: Object = {
  };

  execute = ({
    key,
    id,
    value
  }: {
    key: string,
    id: ?string,
    value: any
  }): any => {
    const callback = this.findCallback(key, id);
    return callback(value);
  }

  findCallback = (key: string, id: ?string) => {
    let callback: any = v => v;
    callback = get(this._map, [key, id || 'DEFAULT'], callback);
    return callback;
  }

  registerCallback = (key: string, id: ?string, callback: Function) => {
    set(this._map, [key, id || 'DEFAULT'], callback);
  }

  unregisterCallback = (key: string, id: ?string) => {
    unset(this._map, [key, id || 'DEFAULT']);
  }
}