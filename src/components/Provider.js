/**
 * @flow
 */

import * as React from 'react';
import isArray from 'lodash/isArray';
import {HOCContext} from '../hocs/context';
import {ApolloProvider} from 'react-apollo';
import type ApolloClient from 'apollo-boost';
import {ActionManager, actionToMutation, actionsToVariables} from '../action';
import type {Action, ActionType} from '../action/types';

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

  constructor(props: Props) {
    super(props);
    this.actionManager = new ActionManager();
  }

  deploy = (key: string, id?: string): Promise.resolve<*> => {
    const {client} = this.props;
    const actions = this.actionManager.getActions(key, id);
    const mutation = actionToMutation(actions);
    const variables = actionsToVariables(actions);
    return client.mutate({
      fetchPolicy: 'cache-and-network',
      mutation,
      variables,
    });
  }

  request = (action: Action<ActionType>): Promise.resolve<*> => {
    const {client} = this.props;
    this.actionsManager.addAction(action);
    const mutation = actionToMutation([action]);
    const variables = actionsToVariables([action]);
    return client.mutate({
      fetchPolicy: 'cache-only',
      mutation,
      variables
    });
  }

  _splitKey(path: string | [string, string]) {
    return isArray(path) ?
      path[0].split('/')[0] :
      // $FlowFixMe
      path.split('/')[0];
  }

  render() {
    const {client} = this.props;
    return <ApolloProvider client={client}>
      <HOCContext.Provider value={{
        request: this.request,
        deploy: this.deploy,
      }}>
        {React.Children.only(this.props.children)}
      </HOCContext.Provider>
    </ApolloProvider>
  }
}
