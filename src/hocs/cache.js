// @flow
import * as React from 'react';
import {mutate as defaultMutate, ActionManager as DefaultAciontManager} from '../action';
import {isCompleteContain, genPaths} from './route';
import { isArray } from 'lodash';
import { OnDeployManager } from '../onDeployManager';
import type {Action, ActionType} from '../action/types';
import type {HOCProps} from './types';

type State = {
  [string]: *
}

export default function withCache(Com: React.ComponentType<*>, options: {
  mutate: typeof defaultMutate,
  ActionManager: DefaultAciontManager,
  onDeployManager: OnDeployManager
}) {
  const {mutate = defaultMutate, ActionManager = DefaultAciontManager} = options || {};
  return class ComWithCache extends React.Component<HOCProps, State> {
  actionManager: ?ActionManager;
  onDeployManager: OnDeployManager;
  subscribers: {
      [key: string]: Array<{id: string, callback: Function}>
    }
    subscribers = {};
    subscription: any;
    constructor(props: HOCProps) {
      super(props);
      const {routes, cacheActions, pattern, path} = this.props;
      if ((routes.length > 1 && isRoutesEndAtMe({routes, pattern, path})) ||
        cacheActions
      ) {
        this.actionManager = new ActionManager();
        this.onDeployManager = new OnDeployManager();
      }
      this.state = {
      };
    }

    addSubscriber = (key: string, id: string, callback: Function) => {
      const subscriber = {
        id,
        callback
      };
      if (this.subscribers[key]) {
        this.subscribers[key].push(subscriber);
      } else {
        this.subscribers[key] = [subscriber];
      }
    }

    unsubscribe = (key: string, subscriberId: string) => {
      this.subscribers[key] = this.subscribers[key].filter(subscriber => {
        return subscriber.id !== subscriberId;
      });
    }

    publish = (key: string, id?: string) => {
      // $FlowFixMe
      if (!this.actionManager) {
        return;
      }
      const data = this.state[key];
      if (!data) {
        return;
      }
      const actions = this.actionManager.getActions(key, id);
      const mutatedData = actions.reduce((result, action) => {
        return mutate(result, action);
      }, data);
      (this.subscribers[key] || []).forEach(subscribe => {
        subscribe.callback(mutatedData);
      });
    }

    fetch = (key: string) => {
      // the data will be mutated by cached actions
      const {fetch} = this.props;
      if (!this.actionManager) {
        return fetch(key);
      }
      const actions = this.actionManager.getActions(key);
      return fetch(key).then(data => {
        this.setState({
          [key]: data
        });
        this._subscribe(key);
        return actions.reduce((result, action) => {
          return mutate(result, action);
        }, data);
      });
    }

    _subscribe = (key: string) => {
      const {subscribe} = this.props;
      this.subscription = subscribe(key, (data) => {
        this.setState({
          [key]: data
        }, () => this.publish(key));
      });
    }

    _unsubscribe = () => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    request = (action: Array<Action<ActionType>> | Action<ActionType>): Promise<*> => {
      // use action manager cache the actions
      // update state.actions
      const {request} = this.props;
      if (!this.actionManager) {
        // $FlowFixMe
        return request(action);
      }
      let key, id;
      if (isArray(action)) {
        // $FlowFixMe
        action.forEach(ac => {
          // $FlowFixMe
          this.actionManager.addAction(ac);
        });
        key = action[0].payload.key;
        id = action[0].payload.id;
      } else {
        // $FlowFixMe
        this.actionManager.addAction(action);
        // $FlowFixMe
        key = action.payload.key;
        // $FlowFixMe
        id = action.payload.id;
      }
      this.publish(key, id);
      return Promise.resolve();
    }

    onDeploy = (key: string, callback: any) => {
      const {onDeploy} = this.props;
      if (!this.onDeployManager) {
        return onDeploy(key, callback);
      }
      return this.onDeployManager.registerCallback(key, callback);
    }

    removeOnDeploy = (key: string, callbackId: string) => {
      const {removeOnDeploy} = this.props;
      if (!this.onDeployManager) {
        return removeOnDeploy(key, callbackId);
      }
      return this.onDeployManager.unregisterCallback(key, callbackId);
    }

    _executeOnDeployCallback = (key: string, value: any) => {
      return this.onDeployManager.execute({
        key,
        value
      });
    }

    deploy = (key: string, id?: string): Promise<*> => {
      // request cached actions
      const {request, deploy, pattern} = this.props;
      if (!this.actionManager) {
        return deploy(key, id);
      }
      const originData = this.state[key];
      let actions = this.actionManager.getActions(key, id);
      const mutatedData = actions.reduce((result, action) => {
        return mutate(result, action);
      }, originData);
      const {error} = this._executeOnDeployCallback(key, mutatedData.get(key));
      if (error) {
        return Promise.reject();
      }
      // actions = actions.map(action => {
      //   const {key, value} = action.payload;
      //   hasError = hasError || error;
      //   action.payload.value = data;
      //   return action;
      // });

      // $FlowFixMe
      this.actionManager.removeActions(key, id);
      // $FlowFixMe
      request(actions);
      // if this cache is on the first layer,
      // it should call the deploy after request
      if (pattern.split('.').length === 1) {
        return deploy(key, id);
      }
      return Promise.resolve();
    }

    reset = (key: string, id?: string): Promise<*> => {
      // remove sepicfic cached actions in actionManager
      const {reset} = this.props;
      if (!this.actionManager) {
        return reset(key, id);
      }
      this.actionManager.removeActions(key, id);
      this.publish(key, id);
      return Promise.resolve();
    }

    subscribe = (key: string, callback: Function) => {
      const {subscribe} = this.props;
      if (!this.actionManager) {
        return subscribe(key, callback);
      }
      const id = genSubscriberId();
      this.addSubscriber(key, id, callback);
      return {
        unsubscribe: () => {
          this.unsubscribe(key, id);
        }
      }
    }

    updateQuery = (paths: Array<string>, args: Object) => {
      const {updateQuery} = this.props;
      const reWatch = updateQuery(paths, args);
      if (reWatch) {
        this._unsubscribe();
        this.fetch(paths[0]);
      }
    }

    render() {
      return (
        <Com
          {...this.props}
          fetch={this.fetch}
          request={this.request}
          deploy={this.deploy}
          reset={this.reset}
          subscribe={this.subscribe}
          updateQuery={this.updateQuery}
          onDeploy={this.onDeploy}
          removeOnDeploy={this.removeOnDeploy}
        />
      );
    }
  }
}

export function isRoutesEndAtMe({
  routes,
  path,
  pattern
}: {
  routes: Array<string>,
  path: string,
  pattern: string
}): boolean {
  const paths = genPaths(path, pattern);
  return (paths.length === routes.length && isCompleteContain(paths, routes));
}

export function genSubscriberId() {
  return Math.random().toString(36).substr(2, 7);
}