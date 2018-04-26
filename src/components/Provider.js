/**
 * @flow
 */

import * as React from 'react';
import {App} from '../app';
import {Bucket, Cache, EndpointMiddleware, Store} from '../app/middleware';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import {HOCContext} from '../hocs/context';
import {ApolloProvider, Mutation} from 'react-apollo';
import type ApolloClient from 'apollo-boost';
import type {graphql} from 'react-apollo';

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
  constructor(props) {
    super(props);
    this.actionManager = new ActionManager();
  }

  deploy = (key: string, id?: string) => {
    const {client} = this.props;
    const action = this.actionManager.getAction(key, id);
    const mutation = actionToMutation(action);
    client.mutate({
      fetchPolicy: 'cache-and-network',
      mutation
    });
  }

  request = (action: Action) => {
    const {client} = this.props;
    const mutation = actionToMutation(action);
    client.mutate({
      fetchPolicy: 'cache-only',
      mutation
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
