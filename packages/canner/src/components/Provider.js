/**
 * @flow
 */

import * as React from 'react';
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
import type {ProviderProps} from './types';
import type {Action, ActionType} from '../action/types';

type Props = ProviderProps;

type State = {
  dataChanged: Object,
};

export default class Provider extends React.PureComponent<Props, State> {
  actionManager: ActionManager;
  query: Query;
  observableQueryMap: {[string]: any}
  onDeployManager: OnDeployManager;

  state = {
    dataChanged: {}
  };

  constructor(props: Props) {
    super(props);
    this.actionManager = new ActionManager();
    this.genQuery();
    this.genObservableQueryMap();
    this.onDeployManager = new OnDeployManager();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const {rootKey, routes, schema, routerParams} = nextProps;
    const customizedGQL = schema[rootKey] && schema[rootKey].graphql;
    if (customizedGQL) {
      this.observableQueryMap[rootKey] = this.getObservable({
        routes: routes,
        operator: routerParams.operator
      });
    }
  }

  genQuery = () => {
    const {schema} = this.props;
    this.query = new Query({schema});
  }

  genObservableQueryMap = () => {
    const {schema, routes, routerParams} = this.props;
    this.observableQueryMap = mapValues(schema, (v, key) => {
      if (routes[0] === key) {
        return this.getObservable({
          routes: routes,
          operator: routerParams.operator
        })
      }
      return this.getObservable({
        routes: [key],
        operator: 'update'
      });
    });
  }

  getObservable = ({
    routes,
    operator
  }: {
    routes: Array<string>,
    operator: string
  }) => {
    const {client, schema} = this.props;
    const key = routes[0];
    const variables = this.query && this.query.getVairables();
    const customizedGQL = routes.length === 1 && operator === 'update' && schema[key].graphql;
    const fetchPolicy = schema[key].fetchPolicy;
    let gqlStr = ''
    if (customizedGQL) {
      gqlStr = schema[key].graphql;
    } else {
      gqlStr = this.query.toGQL(key);
    }
    return client.watchQuery({
      query: gql`${gqlStr}`,
      variables,
      options: {
        fetchPolicy: routes.length === 1 && operator === 'update' ? 'cache-first' : fetchPolicy
      }
    });
  }

  updateDataChanged = () => {
    const {dataDidChange} = this.props;
    const actions = this.actionManager.getActions();
    let dataChanged = groupBy(actions, (action => action.payload.key));
    dataChanged = mapValues(dataChanged, value => {
      if (value[0].type === 'UPDATE_OBJECT') {
        return true;
      }
      return value.map(v => v.payload.id);
    });
    if (dataDidChange) {
      dataDidChange(dataChanged);
    }
    this.setState({dataChanged});
  }

  updateQuery = (paths: Array<string>, args: Object) => {
    const {routerParams} = this.props;
    const originVariables = this.query.getVairables();
    this.query.updateQueries(paths, 'args', args);
    const variables = this.query.getVairables();
    const reWatchQuery = compareVariables(originVariables, variables);
    if (reWatchQuery) {
      this.observableQueryMap[paths[0]] = this.getObservable({
        routes: paths,
        operator: routerParams.operator
      });
      log('updateQuery rewatch', variables, args);
      return Promise.resolve(reWatchQuery);
    } else {
      log('updateQuery', variables, args);
      return this.observableQueryMap[paths[0]].setVariables(variables, false).then(() => false);
    }
  }

  // path: posts/name args: {where, pagination, sort}
  fetch = (key: string): Promise.resolve<*> => {
    const {errorHandler} = this.props;
    const observabale = this.observableQueryMap[key];
    const currentResult = observabale.currentResult();
    const {loading, error} = currentResult;
    if (loading) {
      return observabale.result()
        .then(result => {
          log('fetch', 'loading', key, result);
          return result.data;
        }).catch(e => {
          errorHandler && errorHandler(e);
        })
    } else if (error) {
      const lastResult = observabale.getLastResult();
      log('fetch', 'error', key, lastResult);
      errorHandler && errorHandler(error);
      return Promise.resolve(lastResult.data);
    } else {
      log('fetch', 'loaded', key, currentResult, this.query.getVairables());
      return Promise.resolve(currentResult.data);
    }
  }

  subscribe = (key: string, callback: (data: any) => void) => {
    const observableQuery = this.observableQueryMap[key];
    return observableQuery.subscribe({
      next: () => {
        const {loading, errors, data} = observableQuery.currentResult();
        if (!loading && !errors && data && !isEmpty(data)) {
          callback(data);
        }
      },
      error: () => {
        // ignore the error here since in fetch method, the error should be handled
      }
    });
  }

  executeOnDeploy = (key: string, value: any) => {
    return this.onDeployManager.execute({
      key,
      value
    });
  }

  deploy = (key: string, id?: string): Promise<*> => {
    const {client, afterDeploy, schema, errorHandler, routes, rootKey, routerParams} = this.props;
    let actions = this.actionManager.getActions(key, id);
    if (!actions || !actions.length) {
      return Promise.resolve();
    }
    actions = removeIdInCreateArray(actions);
    const mutation = objectToQueries(actionToMutation(actions[0]), false);
    const variables = actionsToVariables(actions, schema);
    const queryVariables = this.query.getVairables();  
    let query = null;
    if (routes.length === 1 && routerParams.operator === 'update' && schema[rootKey].graphql) {
      query = gql`${schema[rootKey].graphql}`;
    } else {
      query = gql`${this.query.toGQL(actions[0].payload.key)}`;
    }
    const cachedData = client.readQuery({query, variables: queryVariables});
    const mutatedData = cachedData[key];
    const {error} = this.executeOnDeploy(key, mutatedData);
    if (error) {
      errorHandler && errorHandler(new Error('Invalid field'));
      return Promise.reject(error);
    }

    return client.mutate({
      mutation: gql`${mutation}`,
      variables
    }).then(result => {
      if (actions[0].type === 'CREATE_ARRAY') {
        this.updateID({
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
      this.actionManager.removeActions(key, id);
      return result.data;
    }).then(result => {
      this.updateDataChanged();
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
  }

  updateID({
    action,
    result
  }: {
    action: Action<ActionType>,
    result: any
  }) {
    const {client} = this.props;
    const originId = action.payload.id;
    const key = action.payload.key;
    const resultKey = `create${upperFirst(pluralize.singular(key))}`;
    const newId = result.data[resultKey].id;
    const variables = this.query.getVairables();  
    const query = gql`${this.query.toGQL(key)}`;
    const data = client.readQuery({query, variables});
    data[key].edges.map(edge => {
      if (edge.cursor === originId) {
        edge.cursor = newId;
        edge.node.id = newId;
      }
      return edge;
    });
    client.writeQuery({
      query,
      variables,
      data
    });
  }

  reset = (key?: string, id?: string): Promise<*> => {
    const {rootKey} = this.props;
    if (this.actionManager.getActions(key, id).length === 0) {
      return Promise.resolve();
    }
    this.actionManager.removeActions(key, id);
    this.updateDataChanged();
    const variables = this.query.getVairables();
    if (this.observableQueryMap[(key || rootKey)]) {
      return this.observableQueryMap[key || rootKey].refetch(variables);
    }
    return Promise.resolve();
  }

  request = (action: Array<Action<ActionType>> | Action<ActionType>, options: {write: boolean} = {write: true}): Promise<*> => {
    const {write = true} = options;
    const actions = [].concat(action);
    if (actions.length === 0) {
      return Promise.resolve();
    }
    actions.forEach(ac => this.actionManager.addAction(ac));
    this.updateDataChanged();
    if (write) {
      const {data, mutatedData} = this.updateCachedData(actions);
      log('request', action, data, mutatedData);
    }
    return Promise.resolve();
  }

  updateCachedData = (actions: Array<Action<ActionType>>) => {
    const {client, schema, routes, rootKey, routerParams} = this.props;
    const variables = this.query.getVairables();  
    let query = null;
    if (routes.length === 1 && routerParams.operator === 'update' && schema[rootKey].graphql) {
      query = gql`${schema[rootKey].graphql}`;
    } else {
      query = gql`${this.query.toGQL(actions[0].payload.key)}`;
    }
    const data = client.readQuery({query, variables});
    const mutatedData = actions.reduce((result: Object, ac: any) => mutate(result, ac), data);
    client.writeQuery({
      query,
      variables,
      data: mutatedData
    });
    return {data, mutatedData};
  }

  render() {
    const {client} = this.props;
    return <ApolloProvider client={client}>
      {/* $FlowFixMe */}
      <HOCContext.Provider value={{
        request: this.request,
        deploy: this.deploy,
        fetch: this.fetch,
        reset: this.reset,
        updateQuery: this.updateQuery,
        subscribe: this.subscribe,
        query: this.query,
        onDeploy: this.onDeployManager.registerCallback,
        removeOnDeploy: this.onDeployManager.unregisterCallback,
        dataChanged: this.state.dataChanged
      }}>
        {/* $FlowFixMe */}
        {React.cloneElement(this.props.children, {
          request: this.request,
          deploy: this.deploy,
          fetch: this.fetch,
          reset: this.reset,
          updateQuery: this.updateQuery,
          subscribe: this.subscribe,
          query: this.query,
          onDeploy: this.onDeployManager.registerCallback,
          removeOnDeploy: this.onDeployManager.unregisterCallback
        })}
      </HOCContext.Provider>
    </ApolloProvider>;
  }
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