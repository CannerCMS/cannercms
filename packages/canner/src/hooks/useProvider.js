/**
 * @flow
 */

import React, {useEffect, useCallback, useState, useRef, useImperativeHandle, forwardRef, useMemo} from 'react';
import {actionToMutation, actionsToVariables} from '../action';
import gql from 'graphql-tag';
import {createEmptyData} from 'canner-helpers';
import {objectToQueries} from '../query/utils';
import {groupBy, mapValues} from 'lodash';
import log from '../utils/log';
import { parseConnectionToNormal } from '../hocs/utils';
import useActionManager from '../hooks/useActionManager';
import useQuery from '../hooks/useQuery';
import useApollo from '../hooks/useApollo';
import useOnDeployManager from '../hooks/useOnDeployManager';
import useCache from '../hooks/useCache';
import type {ProviderProps} from '../components/types';
import type {Action, ActionType} from '../action/types';

type Props = ProviderProps;

export default function useProvider({
  schema,
  routes,
  client,
  dataDidChange,
  errorHandler,
  afterDeploy
}: any) {
  // ensure these instance only create at first rendering
  const actionManager = useActionManager();
  const query = useQuery(schema);
  const apollo = useApollo({
    schema,
    routes,
    client
  });
  const cache = useCache();
  const onDeployManager = useOnDeployManager();

  const [changedData, setChangedData] = useState(null);
  

  const updateChangedData = () => {
    const actions = actionManager.getActions();
    let changedData = groupBy(actions, (action => action.payload.key));
    changedData = mapValues(changedData, value => {
      if (value[0].type === 'UPDATE_OBJECT') {
        return true;
      }
      return value.map(v => v.payload.id);
    });
    if (dataDidChange) {
      dataDidChange(changedData);
    }
    setChangedData(changedData)
  };

  const fetch = (key: string, refetch: boolean = false): Promise<*> => {
    const queryKey = query.getQueryKey(key);
    // if the data is cached, return it
    if (cache.isCached(queryKey) && !refetch) {
      const cachedData = cache.getData(queryKey);
      log('fetch', 'cached', cachedData);
      return Promise.resolve(cachedData);
    }
    // get the data from apollo and store in cache
    return apollo.fetch(key, query).then(({data}) => {
      const cachedData = {
        data,
        rootValue: parseConnectionToNormal(data)
      }
      log('fetch', 'apollo', cachedData);
      cache.setData(queryKey, cachedData);
      return cachedData;
    });
  };

  const create = (key: string): Promise<*> => {
    const queryKey = query.getQueryKey(key);
    const {items} = schema[key];
    const defaultData = createEmptyData(items);
    const id = randomId();
    defaultData.id = id;
    if (cache.isCached(queryKey)) {
      request({
        type: 'CREATE_ARRAY',
        payload: {
          key,
          id,
          value: defaultData,
          path: ''
        }
      })
    } else {
      cache.setData(queryKey, {
        data: {[key]: {edges: [{cursor: id, node: defaultData}]}},
        rootValue: {[key]: [defaultData]}
      });
    }
    return Promise.resolve(cache.getData(queryKey));
  }

  const subscribe = (key: string, callback: Function): any => {
    const queryKey = query.getQueryKey(key);
    const subscriptionId = cache.subscribe(queryKey, callback);
    return {
      unsubscribe: () => cache.unsubscribe(queryKey, subscriptionId)
    }
  }

  const updateQuery = (paths: Array<string>, args: Object): Promise<*> => {
    query.updateQueries(paths, 'args', args);
    const variables = query.getVariables();
    log('updateQuery', {variables})
    return fetch(paths[0], true)
      .then(() => true);
  };

  const reset = async (key: string = routes[0], id?: string): Promise<*> => {
    if (actionManager.getActions(key, id).length === 0) {
      return Promise.resolve();
    }
    actionManager.removeActions(key, id);
    await apollo.reset();
    updateChangedData();

    return Promise.resolve();
  }

  const deploy = async (key: string, id?: string): Promise<*> => {
    let actions = actionManager.getActions(key, id);
    if (!actions || !actions.length) {
      return Promise.resolve();
    }
    actions = removeIdInCreateArray(actions);
    const mutation = objectToQueries(actionToMutation(actions[0]), false);
    const variables = actionsToVariables(actions, schema);
    const queryKey = query.getQueryKey(key);
    const cachedData = cache.getData(queryKey);
    const mutatedData = cachedData.data[key];
    const {error} = onDeployManager.publish(key, mutatedData);
    if (error) {
      errorHandler && errorHandler(new Error('Invalid field'));
      return Promise.reject(error);
    }
    try {
      const result = await client.mutate({
        mutation: gql`${mutation}`,
        variables
      });
      const {data} = result;
      await reset();
      log('deploy', key, {
        id,
        result,
        mutation,
        variables
      });
      actionManager.removeActions(key, id);
      updateChangedData();
      afterDeploy && afterDeploy({
        key,
        id: id || '',
        result: data,
        actions
      });
      return data;
    } catch (e) {
      errorHandler && errorHandler(e);
      log('deploy', e, key, {
        id,
        mutation,
        variables
      });
      // to hocs
      throw e;
    }

  };

  const request = (action: Array<Action<ActionType>> | Action<ActionType>, options: {write: boolean} = {write: true}): Promise<*> => {
    const {write = true} = options;
    const actions = [].concat(action);
    if (actions.length === 0) {
      return Promise.resolve();
    }
    actions.forEach(ac => actionManager.addAction(ac));
    updateChangedData();
    if (write) {
      const data = updateCachedData(actions);
      log('request', action, data);
    }
    return Promise.resolve();
  }

  const updateCachedData = (actions: Array<Action<ActionType>>) => {
    const queryKey = query.getQueryKey(routes[0]);
    cache.mutate(queryKey, actions);
    return cache.getData(queryKey);
  }
  const provider = useMemo(() => ({
    request: request,
    deploy: deploy,
    fetch: fetch,
    reset: reset,
    updateQuery,
    subscribe,
    query: query,
    create: create,
    client,
    onDeploy: onDeployManager.subscribe,
    removeOnDeploy: onDeployManager.unsubscribe,
    dataChanged: changedData
  }), [schema, routes]);
  return provider
}

function removeIdInCreateArray(actions: Array<Action<ActionType>>) {
  return actions.map(action => {
    if (action.type === 'CREATE_ARRAY') {
      const newAction = JSON.parse(JSON.stringify(action));
      delete newAction.payload.value.id;
      delete newAction.payload.value.__typename;
      return newAction;
    }
    return action;
  });
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}