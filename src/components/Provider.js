/**
 * @flow
 */

import * as React from 'react';
import {HOCContext} from '../hocs/context';
import {ApolloProvider} from 'react-apollo';
import type ApolloClient from 'apollo-boost';
import isEmpty from 'lodash/isEmpty';
import {ActionManager, actionToMutation, actionsToVariables, mutatePure} from '../action';
import {Query} from '../query';
import {OnDeployManager} from '../onDeployManager';
import type {Action, ActionType} from '../action/types';
import gql from 'graphql-tag';
import {fromJS} from 'immutable';
import {objectToQueries} from '../query/utils';
import mapValues from 'lodash/mapValues';
import {isArray, groupBy} from 'lodash';
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
    this.query = new Query({schema: props.schema});
    const variables = this.query.getVairables();
    this.observableQueryMap = mapValues(props.schema, (v, key) => {
      const gqlStr = this.query.toGQL(key);
      this.log('gqlstr', gqlStr);
      return props.client.watchQuery({
        query: gql`${gqlStr}`,
        variables
      });
    });
    this.onDeployManager = new OnDeployManager();
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
    this.query.updateQueries(paths, 'args', args);
    const variables = this.query.getVairables();
    this.log('updateQuery', variables, args);
    this.observableQueryMap[paths[0]].refetch(variables);
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

  onDeploy = (actions: Array<Action<ActionType>>) => {
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
    const {client, afterDeploy} = this.props;
    let actions = this.actionManager.getActions(key, id);
    if (!actions || !actions.length) {
      return Promise.resolve();
    }
    
    actions = removeIdInCreateArray(actions);
    actions = this.onDeploy(actions);
    const mutation = objectToQueries(actionToMutation(actions[0]), false);
    const variables = actionsToVariables(actions);
    return client.mutate({
      mutation: gql`${mutation}`,
      variables,
    }).then(result => {
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

  reset = (key: string, id?: string): Promise<*> => {
    const {client} = this.props;
    this.actionManager.removeActions(key, id);
    this.updateDataChanged();
    return client.resetStore();
  }

  request = (action: Array<Action<ActionType>> | Action<ActionType>, options: {write: boolean} = {write: true}): Promise<*> => {
    const {client} = this.props;
    const {write = true} = options;
    let query, mutatedData, data;
    const variables = this.query.getVairables();  
    if (isArray(action)) {
      if (!action.length) return Promise.resolve();
      // $FlowFixMe
      action.forEach(ac => this.actionManager.addAction(ac));
      query = gql`${this.query.toGQL(action[0].payload.key)}`;
      data = client.readQuery({query, variables});
      this.log('request', action, data);
    // $FlowFixMe
      mutatedData = action.reduce((result, ac) => mutatePure(result, ac), data);
    } else {
      this.actionManager.addAction(action);
      // $FlowFixMe
      query = gql`${this.query.toGQL(action.payload.key)}`;
      // $FlowFixMe
      data = client.readQuery({query, variables});
      this.log('request', action, data);
      mutatedData = mutatePure(data, action)
    }
    this.log('request', 'mutatedData', mutatedData);
    this.updateDataChanged();
    if (write) {
      client.writeQuery({
        query,
        variables,
        data: mutatedData
      });
    }
    return Promise.resolve();
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
