// @flow
import {useContext, useState} from 'react';
import {Context} from 'canner-helpers';
import {mapValues, groupBy, isArray} from 'lodash';
import {isCompleteContain, genPaths} from '../utils/renderType';
import useCache from './useCache';
import useOnDeployManager from './useOnDeployManager';
import useActionManager from './useActionManager';
import type {Action, ActionType} from '../action/types';

export default ({
  pattern,
  path,
}: {
  pattern: string,
  path: string
}) => {
  const {
    routes,
    fetch,
    request,
    updateQuery,
    deploy,
    reset,
    removeOnDeploy,
    onDeploy,
    subscribe
  } = useContext(Context);
  const cache = useCache();
  const onDeployManager = useOnDeployManager();
  const actionManager = useActionManager();
  const hasToCache = routes.length > 1 && isRoutesEndAtMe({routes, pattern, path});
  const [changedData, setChangedData] = useState(null);

  const _fetch = (key: string) => {
    // the data will be mutated by cached actions
    if (!hasToCache) {
      return fetch(key);
    }
    return fetch(key).then(result => {
      cache.setData(key, result);
      return result;
    });
  }

  const _subscribe = (key: string, callback: any) => {
    if (!hasToCache) {
      return subscribe(key, callback);
    }
    const subscriptionId = cache.subscribe(key, callback);
    return {
      unsubscribe: () => cache.unsubscribe(key, subscriptionId)
    }
  }

  const updateCachedData = (actions: Array<Action<ActionType>> | Action<ActionType>) => {
    const [key] = routes;
    cache.mutate(key, actions);
    return cache.getData(key);
  }
  const _request = (action: Array<Action<ActionType>> | Action<ActionType>): Promise<*> => {
    // use action manager cache the actions
    // update state.actions
    if (!hasToCache)
      return request(action);
    if (isArray(action)) {
      // $FlowFixMe
      action.forEach(ac => {
        actionManager.addAction(ac);
      });
    } else {
      actionManager.addAction(action);
    }
    updateDataChanged();
    updateCachedData(action);
    return Promise.resolve();
  }

  const _onDeploy = (key: string, callback: any) => {
    if (!hasToCache)
      return onDeploy(key, callback);
    return onDeployManager.subscribe(key, callback);
  }

  const _removeOnDeploy = (key: string, callbackId: string) => {
    if (!hasToCache)
      return removeOnDeploy(key, callbackId);
    return  onDeployManager.unsubscribe(key, callbackId);
  }

  const _deploy = (key: string, id?: string): Promise<*> => {
    if (!hasToCache)
      return deploy(key, id);
    const cachedData = cache.getData(key).data;
    const {error} = onDeployManager.publish(key, cachedData[key]);
    if (error) {
      return Promise.reject();
    }
    const actions = actionManager.getActions(key);
    actionManager.removeActions(key, id);
    updateDataChanged();
    request(actions);
    // if this cache is on the first layer,
    // it should call the deploy after request
    if (pattern.split('.').length === 1) {
      return deploy(key, id);
    }
    return Promise.resolve();
  }

  const _reset = (key: string, id?: string): Promise<*> => {
    // remove sepicfic cached actions in actionManager
    if (!hasToCache)
      return reset(key, id);
    actionManager.removeActions(key, id);
    updateDataChanged();
    return _fetch(key);
  }

  const updateDataChanged = () => {
    if (!hasToCache)
      return;
    const actions = actionManager.getActions();
    let changedData = groupBy(actions, (action => action.payload.key));
    changedData = mapValues(changedData, value => {
      if (value[0].type === 'UPDATE_OBJECT') {
        return true;
      }
      return value.map(v => v.payload.id);
    });
    setChangedData(changedData)
  }

  const _updateQuery = (paths: Array<string>, args: Object) => {
    return updateQuery(paths, args)
      .then(reWatch => {
        if (reWatch) {
          _reset(paths[0])
        }
        return reWatch;
      });
  };

  return {
    changedData,
    subscribe: _subscribe,
    fetch: _fetch,
    unsubscribe: _subscribe,
    reset: _reset,
    updateQuery: _updateQuery,
    request: _request,
    onDeploy: _onDeploy,
    removeOnDeploy: _removeOnDeploy,
    deploy: _deploy
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