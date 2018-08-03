// @flow
import type {ActionManagerDef, Action, ActionType } from './types';
import get from 'lodash/get';
import set from 'lodash/set';
import updateWith from 'lodash/updateWith';
import isArray from 'lodash/isArray';
import ObjectPattern from './pattern/objectPattern';
import ArrayPattern from './pattern/arrayPattern';
import ConnectPattern from './pattern/connectPattern';

export class ActionManager implements ActionManagerDef {
  store = {};
  addAction = (action: Action<ActionType>): void => {
    const {key, id} = action.payload;
    if (action.type === 'UPDATE_OBJECT') {
      const pattern = get(this.store, [key], new ObjectPattern());
      pattern.addAction(action);
      set(this.store, [key], pattern);
    } else if (action.type === 'CREATE_ARRAY' || action.type === 'UPDATE_ARRAY' || action.type === 'DELETE_ARRAY') {
      let patternItem = get(this.store, [key], []).find(item => item.id === id);
      if (patternItem) {
        patternItem.array.addAction(action);
        updateWith(this.store, key, list => list.map(item => item.id === id ? patternItem : item));
      } else {
        patternItem = {
          id,
          array: new ArrayPattern(),
          connect: new ConnectPattern()
        };
        // $FlowFixMe
        patternItem.array.addAction(action);
        updateWith(this.store, key, list => (list || []).concat(patternItem));
      }
    } else if (action.type === 'CONNECT' || action.type === 'DISCONNECT' || action.type === 'CREATE_AND_CONNECT' || action.type === 'DISCONNECT_AND_DELETE') {
      let patternItem = get(this.store, [key], []).find(item => item.id === id);
      if (patternItem) {
        patternItem.connect.addAction(action);
        updateWith(this.store, key, list => list.map(item => item.id === id ? patternItem : item));
      } else {
        patternItem = {
          id,
          array: new ArrayPattern(),
          connect: new ConnectPattern()
        };
        // $FlowFixMe
        patternItem.connect.addAction(action);
        updateWith(this.store, key, list => (list || []).concat(patternItem));
      }
    }
  }

  getActions = (key?: string, id?: string): Array<any> => {
    if (!key) {
      return Object.keys(this.store).reduce((result: any, key: any) => {
        return result.concat(this.getActions(key));
      }, []);
    }
    const item = get(this.store, key);
    if (item instanceof ObjectPattern) {
      return item.getActions();
    } else if (isArray(item)) {
      if (id) {
        const patternItem = item.find(item => item.id === id) || {
          array: new ArrayPattern(),
          connect: new ConnectPattern()
        };
        // $FlowFixMe
        return patternItem.array.getActions().concat(patternItem.connect.getActions());
      } else {
        return item.reduce((result: Array<any>, currItem: Object) => {
          const actions = currItem.array.getActions().concat(currItem.connect.getActions());
          return result.concat(actions);
        }, []);
      }
    } else {
      return [];
    }
  }

  removeActions = (key: string, id?: string) => {
    if (!key) {
      return Object.keys(this.store).forEach(key => {
        this.removeActions(key);
      });
    }
    const item = get(this.store, key);
    if (item instanceof ObjectPattern) {
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