/**
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {HOCContext} from '../hocs/context';
import {ApolloProvider} from 'react-apollo';
import isEmpty from 'lodash/isEmpty';
import pluralize from 'pluralize';
import upperFirst from 'lodash/upperFirst';
import {ActionManager, actionToMutation, actionsToVariables, mutate} from '../action';
import {Query} from '../query';
import {OnDeployManager} from '../onDeployManager';
import gql from 'graphql-tag';
import {objectToQueries} from '../query/utils';
import mapValues from 'lodash/mapValues';
import {groupBy, difference} from 'lodash';
import log from '../utils/log';
import { parseConnectionToNormal } from '../hocs/utils';
import type {ProviderProps} from './types';
import type {Action, ActionType} from '../action/types';

type Props = ProviderProps;

export default function Provider({
  schema,
  routes,
  routerParams,
  client,
  rootKey,
  dataDidChange,
  errorHandler,
  children,
  afterDeploy
}: Props) {
  const actionManager = new ActionManager();
  const query = new Query({schema});
  const getObservable = ({
    routes,
    operator
  }: {
    routes: Array<string>,
    operator: string
  }) => {
    const key = routes[0];
    const variables = query.getVairables();
    const customizedGQL = routes.length === 1 && operator === 'update' && schema[key].graphql;
    const fetchPolicy = schema[key].fetchPolicy;
    let gqlStr = ''
    if (customizedGQL) {
      gqlStr = schema[key].graphql;
    } else {
      gqlStr = query.toGQL(key);
    }
    return client.watchQuery({
      query: gql`${gqlStr}`,
      variables,
      fetchPolicy: routes.length > 1 && operator === 'update' ? fetchPolicy : 'cache-first'
    });
  }

  const observableQueryMap = mapValues(schema, (v, key) => {
    if (routes[0] === key) {
      return getObservable({
        routes: routes,
        operator: routerParams.operator
      })
    }
    return getObservable({
      routes: [key],
      operator: 'update'
    });
  });
  const onDeployManager = new OnDeployManager();
  const [changedData, setChangedData] = useState(null);
  
  useEffect(() => {
    const customizedGQL = schema[rootKey] && schema[rootKey].graphql;
    if (customizedGQL) {
      observableQueryMap[rootKey] = getObservable({
        routes: routes,
        operator: routerParams.operator
      });
    }
  }, [rootKey]);

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

  const updateQuery = (paths: Array<string>, args: Object) => {
    const originVariables = query.getVairables();
    query.updateQueries(paths, 'args', args);
    const variables = query.getVairables();
    const reWatchQuery = compareVariables(originVariables, variables);
    if (reWatchQuery) {
      observableQueryMap[paths[0]] = getObservable({
        routes: paths,
        operator: routerParams.operator
      });
      log('updateQuery rewatch', variables, args);
      return Promise.resolve(reWatchQuery);
    } else {
      const refetch = (routes.length > 1 && schema[paths[0]] && schema[paths[0]].refetch);
      log('updateQuery', variables, args);
      if (refetch) {
        return observableQueryMap[paths[0]].refetch(variables).then(() => false);
      }
      return observableQueryMap[paths[0]].setVariables(variables).then(() => false);
    }
  };

  // path: posts/name args: {where, pagination, sort}
  const fetch = (key: string): Promise.resolve<*> => {
    const observabale = observableQueryMap[key];
    const currentResult = observabale.currentResult();
    const {loading, error} = currentResult;
    if (loading) {
      return observabale.result()
        .then(result => {
          log('fetch', 'loading', key, result);
          return {data: result.data, rootValue: parseConnectionToNormal(result.data)};
        }).catch(e => {
          errorHandler && errorHandler(e);
        })
    } else if (error) {
      const lastResult = observabale.getLastResult();
      log('fetch', 'error', key, lastResult);
      errorHandler && errorHandler(error);
      return Promise.resolve({data: lastResult.data, rootValue: parseConnectionToNormal(lastResult.data)});
    } else {
      log('fetch', 'loaded', key, currentResult, query.getVairables());
      return Promise.resolve({data: currentResult.data, rootValue: parseConnectionToNormal(currentResult.data)});
    }
  };

  const subscribe = (key: string, callback: (data: any) => void) => {
    const observableQuery = observableQueryMap[key];
    return observableQuery.subscribe({
      next: () => {
        const {loading, errors, data} = observableQuery.currentResult();
        if (!loading && !errors && data && !isEmpty(data)) {
          callback({data, rootValue: parseConnectionToNormal(data)});
        }
      },
      error: () => {
        // ignore the error here since in fetch method, the error should be handled
      }
    });
  };

  const executeOnDeploy = (key: string, value: any) => {
    return onDeployManager.execute({
      key,
      value
    });
  }

  const deploy = (key: string, id?: string): Promise<*> => {
    let actions = actionManager.getActions(key, id);
    if (!actions || !actions.length) {
      return Promise.resolve();
    }
    actions = removeIdInCreateArray(actions);
    const mutation = objectToQueries(actionToMutation(actions[0]), false);
    const variables = actionsToVariables(actions, schema);
    const queryVariables = query.getVairables();  
    let graphqlQuery = '';
    if (routes.length === 1 && routerParams.operator === 'update' && schema[rootKey].graphql) {
      graphqlQuery = gql`${schema[rootKey].graphql}`;
    } else {
      graphqlQuery = gql`${query.toGQL(actions[0].payload.key)}`;
    }
    const cachedData = client.readQuery({query: graphqlQuery, variables: queryVariables});
    const mutatedData = cachedData[key];
    const {error} = executeOnDeploy(key, mutatedData);
    if (error) {
      errorHandler && errorHandler(new Error('Invalid field'));
      return Promise.reject(error);
    }
    return client.mutate({
      mutation: gql`${mutation}`,
      variables
    }).then(result => {
      if (actions[0].type === 'CREATE_ARRAY') {
        updateID({
          action: actions[0],
          result
        });
        client.resetStore();
      }
      log('deploy', key, {
        id,
        result,
        mutation,
        variables
      });
      actionManager.removeActions(key, id);
      return result.data;
    }).then(result => {
      updateChangedData();
      afterDeploy && afterDeploy({
        key,
        id: id || '',
        result,
        actions
      });
      return result;
    }).catch(e => {
      errorHandler && errorHandler(e);
      log('deploy', e, key, {
        id,
        mutation,
        variables
      });
      // to hocs
      throw e;
    });
  };

  const updateID = ({
    action,
    result
  }: {
    action: Action<ActionType>,
    result: any
  }) => {
    const originId = action.payload.id;
    const key = action.payload.key;
    const resultKey = `create${upperFirst(pluralize.singular(key))}`;
    const newId = result.data[resultKey].id;
    const variables = query.getVairables();  
    const graphqlQuery = gql`${query.toGQL(key)}`;
    const data = client.readQuery({query: graphqlQuery, variables});
    data[key].edges.map(edge => {
      if (edge.cursor === originId) {
        edge.cursor = newId;
        edge.node.id = newId;
      }
      return edge;
    });
    client.writeQuery({
      query: graphqlQuery,
      variables,
      data
    });
  }

  const reset = (key?: string, id?: string): Promise<*> => {
    if (actionManager.getActions(key, id).length === 0) {
      return Promise.resolve();
    }
    actionManager.removeActions(key, id);
    updateChangedData();
    const variables = query.getVairables();
    if (observableQueryMap[(key || rootKey)]) {
      return observableQueryMap[key || rootKey].refetch(variables);
    }
    return Promise.resolve();
  }

  const request = (action: Array<Action<ActionType>> | Action<ActionType>, options: {write: boolean} = {write: true}): Promise<*> => {
    const {write = true} = options;
    const actions = [].concat(action);
    if (actions.length === 0) {
      return Promise.resolve();
    }
    actions.forEach(ac => actionManager.addAction(ac));
    updateChangedData();
    if (write) {
      const {data, mutatedData} = updateCachedData(actions);
      log('request', action, data, mutatedData);
    }
    return Promise.resolve();
  }

  const updateCachedData = (actions: Array<Action<ActionType>>) => {
    const variables = query.getVairables();  
    let graphqlQuery = null;
    if (routes.length === 1 && routerParams.operator === 'update' && schema[rootKey].graphql) {
      graphqlQuery = gql`${schema[rootKey].graphql}`;
    } else {
      graphqlQuery = gql`${query.toGQL(actions[0].payload.key)}`;
    }
    const data = client.readQuery({query: graphqlQuery, variables});
    const mutatedData = actions.reduce((result: Object, ac: any) => mutate(result, ac), data);
    client.writeQuery({
      query: graphqlQuery,
      variables,
      data: mutatedData
    });
    return {data, mutatedData};
  }

  return (
    <ApolloProvider client={client}>
      {/* $FlowFixMe */}
      <HOCContext.Provider value={{
        request: request,
        deploy: deploy,
        fetch: fetch,
        reset: reset,
        updateQuery: updateQuery,
        subscribe: subscribe,
        query: query,
        onDeploy: onDeployManager.registerCallback,
        removeOnDeploy: onDeployManager.unregisterCallback,
        dataChanged: changedData
      }}>
        {/* $FlowFixMe */}
        {React.cloneElement(children, {
          request: request,
          deploy: deploy,
          fetch: fetch,
          reset: reset,
          updateQuery: updateQuery,
          subscribe: subscribe,
          query: query,
          onDeploy: onDeployManager.registerCallback,
          removeOnDeploy: onDeployManager.unregisterCallback
        })}
      </HOCContext.Provider>
    </ApolloProvider>
  );
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

function compareVariables(originVariables: Object, variables: Object) {
  const originArr = Object.keys(originVariables).filter(key => originVariables[key]);
  const varArr = Object.keys(variables).filter(key => variables[key]);
  const less = difference(originArr, varArr);
  const more = difference(varArr, originArr);
  if (less.length === 0 && more.length === 0) {
    return false;
  }
  return true
}