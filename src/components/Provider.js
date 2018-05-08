/**
 * @flow
 */

import * as React from 'react';
import {HOCContext} from '../hocs/context';
import {ApolloProvider} from 'react-apollo';
import type ApolloClient from 'apollo-boost';
import isEmpty from 'lodash/isEmpty';
import {ActionManager, actionToMutation, actionsToVariables, mutate} from '../action';
import {Query} from '../query';
import type {Action, ActionType} from '../action/types';
import gql from 'graphql-tag';
import {fromJS} from 'immutable';
import {objectToQueries} from '../query/utils';

type Props = {
  schema: {[key: string]: any},
  dataDidChange: void => void,
  children: React.ChildrenArray<React.Node>,
  client: ApolloClient,
  rootKey: string
}

type State = {

}

export default class Provider extends React.PureComponent<Props, State> {
  actionManager: ActionManager;
  query: Query;

  constructor(props: Props) {
    super(props);
    this.actionManager = new ActionManager();
    this.query = new Query({schema: props.schema});
  }

  updateQuery = (path: string, args: Object) => {
    this.query.updateQueries(path.split('/'), 'args', args);
  }

  // path: posts/name args: {where, pagination, sort}
  fetch = (key: string): Promise.resolve<*> => {
    const {client} = this.props;
    const query = this.query.toGQL(key);
    return client.query({
      query: gql`${query}`
    }).then(result => {
      this.log('fetch', key, result);
      return fromJS(result.data);
    });
  }

  subscribe = (key: string, callback: (data: any) => void) => {
    const {client} = this.props;
    const query = this.query.toGQL(key);
    const observableQuery = client.watchQuery({
      query: gql`${query}`
    });

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

  deploy = (key: string, id?: string): Promise.resolve<*> => {
    const {client} = this.props;
    const actions = this.actionManager.getActions(key, id);
    if (!actions || !actions.length) {
      return Promise.resolve();
    }
    const mutation = actionToMutation(actions[0]);
    const variables = actionsToVariables(actions);
    
    return client.mutate({
      mutation: gql`${objectToQueries(mutation, false)}`,
      variables,
    }).then(result => {
      this.log('deploy', key, {
        id,
        variables,
        result
      });
      return fromJS(result.data)
    });
  }

  reset = (key: string, id?: string) => {
    const {client} = this.props;
    this.actionManager.removeActions(key, id);
    return client.resetStore();
  }

  request = (action: Action<ActionType>, options: {write: boolean} = {write: true}): Promise<*> => {
    const {client} = this.props;
    const {write = true} = options;
    this.actionManager.addAction(action);
    const query = gql`${this.query.toGQL(action.payload.key)}`;
    const data = client.readQuery({query});
    this.log('request', action, mutate(fromJS(data), action));
    if (write) {
      client.writeQuery({
        query: query,
        data: mutate(fromJS(data), action).toJS()
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
      default:
        break;
    }
    // eslint-disable-next-line
    console.log("%c" + type, "color:" + color, ...payload);
}

  render() {
    const {client} = this.props;
    return <ApolloProvider client={client}>
      <HOCContext.Provider value={{
        request: this.request,
        deploy: this.deploy,
        fetch: this.fetch,
        reset: this.reset,
        updateQuery: this.updateQuery,
        subscribe: this.subscribe
      }}>
        {React.Children.only(this.props.children)}
      </HOCContext.Provider>
    </ApolloProvider>
  }
}
