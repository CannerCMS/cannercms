// @flow
import * as React from 'react';
import {mutate as defaultMutate, ActionManager as DefaultAciontManager} from '../action';
import type {Action, ActionType} from '../action/types';
import { isCompleteContain, genPaths } from './route';

type Props = {
  request: Function,
  fetch: Function,
  reset: Function,
  deploy: Function,
  routes: Array<string>,
  params: Object,
  cacheActions: boolean,
  pattern: string,
  path: string
}

type State = {
}

export default function withCache(Com: React.ComponentType<*>, options: {
  mutate: typeof defaultMutate,
  ActionManager: DefaultAciontManager
}) {
  const {mutate = defaultMutate, ActionManager = DefaultAciontManager} = options || {};
  return class ComWithCache extends React.Component<Props, State> {
    actionManager: ?ActionManager;
    
    constructor(props: Props) {
      super(props);
      const {routes, params, cacheActions, pattern, path} = this.props;
      if ((routes.length > 1 && isRoutesEndAtMe({routes, pattern, path})) ||
        params.op === 'create' ||
        cacheActions
      ) {
        this.actionManager = new ActionManager();
      }
    }

    fetch = (key: string) => {
      // the data will be mutated by cached actions
      const {fetch} = this.props;
      if (!this.actionManager) {
        return fetch(key);
      }
      const actions = this.actionManager.getActions(key);
      return fetch(key).then(data => {
        return actions.reduce((result, action) => {
          return mutate(data, action);
        }, data);
      });
    }

    request = (action: Action<ActionType>) => {
      // use action manager cache the actions
      // update state.actions
      const {request} = this.props;
      if (!this.actionManager) {
        return request(action);
      }
      this.actionManager.addAction(action);
    }

    deploy = (key: string, id?: string) => {
      // request cached actions
      const {request, deploy} = this.props;
      if (!this.actionManager) {
        return deploy(key, id);
      }
      const actions = this.actionManager.getActions(key, id);
      actions.forEach(action => {
        request(action);
      });
    }

    reset = (key: string, id?: string) => {
      // remove sepicfic cached actions in actionManager
      const {reset} = this.props;
      if (!this.actionManager) {
        return reset(key, id);
      }
      this.actionManager.removeActions(key, id);
    }

    render() {
      return (
        <Com
          {...this.props}
          fetch={this.fetch}
          request={this.request}
          deploy={this.deploy}
          reset={this.reset}
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
