import {CacheI, Action, Listeners, Reducer} from './types';

export default class Cache implements CacheI {
  reducer: (data: any, action: Action) => any;
  data: Record<string, any>;
  listeners: Listeners;
  constructor({reducer}: {reducer: Reducer}) {
    this.reducer = (data, actions) => {
      // action array
      if (Array.isArray(actions)) {
        return actions.reduce(reducer, data);
      }
      // single action
      return reducer(data, actions);
    };
    this.data = {};
    this.listeners = {}
  }

  isCached = key => {
    // check the key is cached or not
    return Boolean(this.data[key]);
  };

  setData = (key, data) => {
    this.data[key] = data;
    this.publish(key);
  }

  getData = key => {
    if (this.isCached(key)) {
      return this.data[key];
    }
    throw new Error(`There is no cached data with key '${key}'`);
  };

  removeData = (key: string) => {
    delete this.data[key];
    delete this.listeners[key];
  }

  mutate = (key, actions) => {
    const originData = this.getData(key);
    const newData = this.reducer(originData, actions);
    this.setData(key, newData);
  }

  subscribe = (key, callback) => {
    const listener = {
      id: randomId(),
      callback
    };
    if (key in this.listeners) {
      this.listeners[key].push(listener) - 1;
    } else {
      this.listeners[key] = [listener];
    }
    return listener.id;
  }

  unsubscribe = (key, id) => {
    if (this.listeners[key]) {
      this.listeners[key] = this.listeners[key].filter(listener => listener.id !== id);
    }
  }

  publish = (key) => {
    const data = this.data[key];
    if (key in this.listeners) {
      this.listeners[key].forEach(listener => {
        listener.callback(data);
      });
    }
  }
}

function randomId(): string {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}