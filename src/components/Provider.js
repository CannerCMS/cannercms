/**
 * @flow
 */

import * as React from 'react';
import {HOCContext} from '../hocs/context';
import {ApolloProvider} from 'react-apollo';
import type ApolloClient from 'apollo-boost';
import isEmpty from 'lodash/isEmpty';
import pluralize from 'pluralize';
import upperFirst from 'lodash/upperFirst';
import {ActionManager, actionToMutation, actionsToVariables, mutatePure} from '../action';
import {Query} from '../query';
import {OnDeployManager} from '../onDeployManager';
import type {Action, ActionType} from '../action/types';
import gql from 'graphql-tag';
import {fromJS} from 'immutable';
import {objectToQueries} from '../query/utils';
import mapValues from 'lodash/mapValues';
import {isArray, groupBy, difference} from 'lodash';
type Props = {
  schema: {[key: string]: any},
  dataDidChange: Object => void,
  afterDeploy: Object => void,
  children: React.Node,
  client: ApolloClient,
  rootKey: string
}

type State = {
}

export default class Provider extends React.PureComponent<Props, State> {
  actionManager: ActionManager;
  query: Query;
  observableQueryMap: {[string]: any}
  onDeployManager: OnDeployManager;

  constructor(props: Props) {
    super(props);
    this.actionManager = new ActionManager();
    this.genQuery();
    this.genObservableQueryMap();
    this.onDeployManager = new OnDeployManager();
  }

  genQuery = () => {
    const {schema} = this.props;
    this.query = new Query({schema});
  }

  genObservableQueryMap = () => {
    const {schema, client} = this.props;
    const variables = this.query && this.query.getVairables();
    this.observableQueryMap = mapValues(schema, (v, key) => {
      const gqlStr = this.query.toGQL(key);
      this.log('gqlstr', gqlStr, variables);
      return client.watchQuery({
        query: gql`${gqlStr}`,
        variables
      });
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
  }

  updateQuery = (paths: Array<string>, args: Object) => {
    const {client} = this.props;
    const originVariables = this.query.getVairables();
    this.query.updateQueries(paths, 'args', args);
    const variables = this.query.getVairables();
    const reWatchQuery = compareVariables(originVariables, variables);
    if (reWatchQuery) {
      const gqlStr = this.query.toGQL(paths[0]);
      this.observableQueryMap[paths[0]] = client.watchQuery({
        query: gql`${gqlStr}`,
        variables
      });
    } else {
      this.observableQueryMap[paths[0]].refetch(variables);
    }
    this.log('updateQuery', variables, args);
    return reWatchQuery;
  }

  // path: posts/name args: {where, pagination, sort}
  fetch = (key: string): Promise.resolve<*> => {
    const observabale = this.observableQueryMap[key];
    const currentResult = observabale.currentResult();
    const {loading, error} = currentResult;
    if (loading) {
      return observabale.result()
        .then(result => {
          this.log('fetch', 'loading', key, result);
          return fromJS(result.data);
        })
    } else if (error) {
      const lastResult = observabale.getLastResult();
      this.log('fetch', 'error', key, lastResult);
      return Promise.resolve(fromJS(lastResult.data));
    } else {
      this.log('fetch', 'loaded', key, currentResult);
      return Promise.resolve(fromJS(currentResult.data));
    }
  }

  subscribe = (key: string, callback: (data: any) => void) => {
    const observableQuery = this.observableQueryMap[key];
    return observableQuery.subscribe({
      next: () => {
        const {loading, errors, data} = observableQuery.currentResult();
        if (!loading && !errors && data && !isEmpty(data)) {
          // this.log('subscribe', key, data);
          callback(fromJS(data));
        }
      } 
    });
  }

  onDeploy = (key: string, id?: string, value: any) => {
    return this.onDeployManager.execute({
      key,
      value
    });
  }

  deploy = (key: string, id?: string): Promise<*> => {
    const {client, afterDeploy, schema} = this.props;
    let actions = this.actionManager.getActions(key, id);
    if (!actions || !actions.length) {
      return Promise.resolve();
    }
    actions = removeIdInCreateArray(actions);
    const mutation = objectToQueries(actionToMutation(actions[0]), false);
    const variables = actionsToVariables(actions, schema);
    variables.payload = this.onDeploy(key, fromJS(variables.payload)).toJS();
    return client.mutate({
      mutation: gql`${mutation}`,
      variables
    }).then(result => {
      if (actions[0].type === 'CREATE_ARRAY') {
        this.updateID({
          action: actions[0],
          result
        });
      }
      this.log('deploy', key, {
        id,
        result,
        mutation,
        variables
      });
      this.actionManager.removeActions(key, id);
      // client.resetStore();
      return fromJS(result.data);
    }).then(result => {
      this.updateDataChanged();
      afterDeploy && afterDeploy({
        key,
        id,
        result
      });
      return result;
    }).catch(e => {
      this.log('deploy', e, key, {
        id,
        mutation,
        variables
      });
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
    this.actionManager.removeActions(key, id);
    this.updateDataChanged();
    const variables = this.query.getVairables();
    return this.observableQueryMap[key || rootKey].refetch(variables);
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
      this.log('request', action, data, mutatedData);
    }
    return Promise.resolve();
  }

  updateCachedData = (actions: Array<Action<ActionType>>) => {
    const {client} = this.props;
    const variables = this.query.getVairables();  
    const query = gql`${this.query.toGQL(actions[0].payload.key)}`;
    const data = client.readQuery({query, variables});
    const mutatedData = actions.reduce((result, ac) => mutatePure(result, ac), data);
    client.writeQuery({
      query,
      variables,
      data: mutatedData
    });
    return {data, mutatedData};
  }

  log(type: string, ...payload: any) {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    let color = "black";

    switch (type) {
      case "request":
        color = "Green";
        break;
      case "fetch":
        color = "DodgerBlue";
        break;
      case "deploy":
        color = "Red";
        break;
      case "subscribe":
        color = "Orange";
        break;
      case 'updateQuery':
        color = 'Brown';
        break;
      default:
        break;
    }
    // eslint-disable-next-line
    console.log("%c" + type, "color:" + color, ...payload);
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
        removeOnDeploy: this.onDeployManager.unregisterCallback
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
      action.payload.value = action.payload.value.update(v => {
        v = v.delete('id');
        v = v.delete('__typename');
        return v;
      });
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