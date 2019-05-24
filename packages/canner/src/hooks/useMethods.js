// @flow
import { useContext, useState } from 'react';
import { Context } from 'canner-helpers';
import { mapValues, groupBy, isArray } from 'lodash';
import RefId from 'canner-ref-id';
import { isCompleteContain, genPaths } from '../utils/renderType';
import useCache from './useCache';
import useOnDeployManager from './useOnDeployManager';
import useActionManager from './useActionManager';
import type { Action, ActionType } from '../action/types';

export default ({
  pattern,
}: {
  pattern: string,
}) => {
  const {
    routes,
    request,
    updateQuery,
    deploy,
    rootValue,
    data,
  } = useContext(Context);
  const [key] = routes;
  const cache = useCache({ [key]: { rootValue, data } });
  const onDeployManager = useOnDeployManager();
  const actionManager = useActionManager();
  const [changedData, setChangedData] = useState(null);

  const updateCachedData = (actions: Array<Action<ActionType>> | Action<ActionType>) => {
    cache.mutate(key, actions);
    return cache.getData(key);
  };
  const _request = (action: Array<Action<ActionType>> | Action<ActionType>): Promise<*> => {
    // use action manager cache the actions
    // update state.actions
    if (isArray(action)) {
      // $FlowFixMe
      action.forEach((ac) => {
        actionManager.addAction(ac);
      });
    } else {
      actionManager.addAction(action);
    }
    updateDataChanged();
    updateCachedData(action);
    return Promise.resolve();
  };

  const _onDeploy = (key: string, callback: any) => onDeployManager.subscribe(key, callback);

  const _removeOnDeploy = (key: string, callbackId: string) => onDeployManager.unsubscribe(key, callbackId);

  const _deploy = (key: string, id?: string): Promise<*> => {
    const cachedData = cache.getData(key).data;
    const { error } = onDeployManager.publish(key, cachedData[key]);
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
  };

  const _reset = (k: string, id?: string): Promise<*> => {
    // remove sepicfic cached actions in actionManager
    let resetKey = k;
    if (k instanceof RefId) {
      resetKey = k.getPathArr()[0];
    }
    actionManager.removeActions(resetKey, id);
    updateDataChanged();
    cache.setData(resetKey, { data, rootValue });
    return Promise.resolve();
  };

  const updateDataChanged = () => {
    const actions = actionManager.getActions();
    let changedData = groupBy(actions, (action => action.payload.key));
    changedData = mapValues(changedData, (value) => {
      if (value[0].type === 'UPDATE_OBJECT') {
        return true;
      }
      return value.map(v => v.payload.id);
    });
    setChangedData(changedData);
  };

  const _updateQuery = (paths: Array<string>, args: Object) => updateQuery(paths, args)
    .then((reWatch) => {
      if (reWatch) {
        _reset(paths[0]);
      }
      return reWatch;
    });

  const value = cache.getData(key);
  return {
    changedData,
    reset: _reset,
    updateQuery: _updateQuery,
    request: _request,
    onDeploy: _onDeploy,
    removeOnDeploy: _removeOnDeploy,
    deploy: _deploy,
    ...value,
  };
};

export function isRoutesEndAtMe({
  routes,
  path,
  pattern,
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
