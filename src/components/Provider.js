/**
 * @flow
 */

import * as React from 'react';
import isArray from 'lodash/isArray';
import {HOCContext} from '../hocs/context';
import {ApolloProvider} from 'react-apollo';
import type ApolloClient from 'apollo-boost';
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
        if (!loading && !errors) {
          this.log('subscribe', key, data);
          callback(fromJS(data));
        }
      } 
    });
  }

  deploy = (key: string, id?: string): Promise.resolve<*> => {
    const {client} = this.props;
    const actions = this.actionManager.getActions(key, id);
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

  request = (action: Action<ActionType>, options: {write: boolean} = {write: true}) => {
    const {client} = this.props;
    const {write = true} = options;
    this.actionManager.addAction(action);
    const query = gql`${this.query.toGQL(action.payload.key)}`;
    const data = client.readQuery({query});
    if (write) {
      client.writeQuery({
        query: query,
        data: mutate(fromJS(data), action).toJS()
      });
    }
    this.log('request', action);
  }

  _splitKey(path: string | [string, string]) {
    return isArray(path) ?
      path[0].split('/')[0] :
      // $FlowFixMe
      path.split('/')[0];
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
        updateQuery: this.updateQuery,
        subscribe: this.subscribe
      }}>
        {React.Children.only(this.props.children)}
      </HOCContext.Provider>
    </ApolloProvider>
  }
}
