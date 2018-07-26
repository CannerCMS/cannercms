// @flow
import * as React from 'react';
import {mutate as defaultMutate, ActionManager as DefaultAciontManager} from '../action';
import {isCompleteContain, genPaths} from './route';
import type {Action, ActionType} from '../action/types';
import { isArray } from 'lodash';
import { OnDeployManager } from '../onDeployManager';

type Props = {
  request: Function,
  fetch: Function,
  reset: Function,
  deploy: Function,
  subscribe: Function,
  updateQuery: Function,
  routes: Array<string>,
  params: Object,
  cacheActions: boolean,
  pattern: string,
  path: string
}

type State = {
  [string]: *
}

export default function withCache(Com: React.ComponentType<*>, options: {
  mutate: typeof defaultMutate,
  ActionManager: DefaultAciontManager,
  onDeployManager: OnDeployManager
}) {
  const {mutate = defaultMutate, ActionManager = DefaultAciontManager} = options || {};
  return class ComWithCache extends React.Component<Props, State> {
  actionManager: ?ActionManager;
  onDeployManager: OnDeployManager;
  subscribers: {
      [key: string]: Array<{id: string, callback: Function}>
    }
    subscribers = {};
    subscription: any;
    constructor(props: Props) {
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

    onDeploy = (actions: Array<Action<ActionType>>) => {
      console.log(this.onDeployManager);
      return actions.map(action => {
        const {key, id, value} = action.payload;
        action.payload.value = this.onDeployManager.execute({
          key,
          id,
          value
        });
        return action;
      });
    }

    deploy = (key: string, id?: string): Promise<*> => {
      // request cached actions
      const {request, deploy, pattern} = this.props;
      if (!this.actionManager) {
        return deploy(key, id);
      }
      let actions = this.actionManager.getActions(key, id);
      actions = this.onDeploy(actions);
      // $FlowFixMe
      this.actionManager.removeActions(key, id);
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
      const onDeploy = this.onDeployManager ?
        this.onDeployManager.registerCallback :
        this.props.onDeploy;
      const removeOnDeploy = this.onDeployManager ?
        this.onDeployManager.unregisterCallback :
        this.props.removeOnDeploy;
      return (
        <Com
          {...this.props}
          fetch={this.fetch}
          request={this.request}
          deploy={this.deploy}
          reset={this.reset}
          subscribe={this.subscribe}
          updateQuery={this.updateQuery}
          // onDeploy={onDeploy}
          // removeOnDeploy={removeOnDeploy}
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