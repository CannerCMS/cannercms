// @flow
import get from 'lodash/get';
import set from 'lodash/set';
import updateWith from 'lodash/updateWith';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import type { ActionManagerDef, Action, ActionType } from './types';
import ObjectPattern from './pattern/objectPattern';
import ArrayPattern from './pattern/arrayPattern';
import ConnectPattern from './pattern/connectPattern';

export class ActionManager implements ActionManagerDef {
  store = {};

  addAction = (action: Action<ActionType>): void => {
    const { key, id } = action.payload;
    if (action.type === 'UPDATE_OBJECT') {
      const patternItem = get(this.store, [key], {
        connect: new ConnectPattern(),
        object: new ObjectPattern(),
      });
      patternItem.object.addAction(action);
      set(this.store, [key], patternItem);
    } else if (action.type === 'CREATE_ARRAY' || action.type === 'UPDATE_ARRAY' || action.type === 'DELETE_ARRAY') {
      let patternItem = get(this.store, [key], []).find(item => item.id === id);
      if (patternItem) {
        patternItem.array.addAction(action);
        updateWith(this.store, key, list => list.map(item => (item.id === id ? patternItem : item)));
      } else {
        patternItem = {
          id,
          array: new ArrayPattern(),
          connect: new ConnectPattern(),
        };
        // $FlowFixMe
        patternItem.array.addAction(action);
        updateWith(this.store, key, list => (list || []).concat(patternItem));
      }
    } else if (action.type === 'CONNECT' || action.type === 'DISCONNECT' || action.type === 'CREATE_AND_CONNECT' || action.type === 'DISCONNECT_AND_DELETE') {
      // relation in object
      let patternItem = get(this.store, [key]);
      if (id && patternItem) {
      // relation in array
        patternItem = patternItem.find(item => item.id === id);
      }
      if (patternItem) {
        patternItem.connect.addAction(action);
        if (id) {
          updateWith(this.store, key, list => list.map(item => (item.id === id ? patternItem : item)));
        } else {
          updateWith(this.store, key, patternItem);
        }
      } else if (id) {
        patternItem = {
          id,
          array: new ArrayPattern(),
          connect: new ConnectPattern(),
        };
        // $FlowFixMe
        patternItem.connect.addAction(action);
        updateWith(this.store, key, list => (list || []).concat(patternItem));
      } else {
        patternItem = {
          object: new ObjectPattern(),
          connect: new ConnectPattern(),
        };
        // $FlowFixMe
        patternItem.connect.addAction(action);
        set(this.store, key, patternItem);
      }
    }
  }

  getActions = (key?: string, id?: string): Array<any> => {
    if (!key) {
      return Object.keys(this.store).reduce((result: any, key: any) => result.concat(this.getActions(key)), []);
    }
    const item = get(this.store, key);
    if (isPlainObject(item)) {
      return item.object.getActions().concat(item.connect.getActions());
    } if (isArray(item)) {
      if (id) {
        // get action by key, id
        const patternItem = item.find(item => item.id === id) || {
          array: new ArrayPattern(),
          connect: new ConnectPattern(),
        };
        // $FlowFixMe
        return patternItem.array.getActions().concat(patternItem.connect.getActions());
      }
      // get all key action
      return item.reduce((result: Array<any>, currItem: Object) => {
        const actions = currItem.array.getActions().concat(currItem.connect.getActions());
        return result.concat(actions);
      }, []);
    }
    return [];
  }

  removeActions = (key: string, id?: string) => {
    if (!key) {
      return Object.keys(this.store).forEach((key) => {
        this.removeActions(key);
      });
    }
    const item = get(this.store, key);
    if (isPlainObject(item)) {
      delete this.store[key];
    } else if (isArray(item)) {
      if (id) {
        updateWith(this.store, key, list => list.filter(item => item.id !== id));
      } else {
        delete this.store[key];
      }
    }
  }
}
