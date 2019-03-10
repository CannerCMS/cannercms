// @flow

import {useRef, useEffect} from 'react';
import gql from 'graphql-tag';
import type { ApolloClient } from 'apollo-boost';

export default ({
  client,
  routes,
  schema
}: {
  client: ApolloClient,
  routes: Array<string>,
  schema: Object
}) => {
  const fetch = (key: string, query: any): Promise<*> => {
    let gqlString = '';
    const customizedGqlString = schema[key].graphql;
    const variables = query.getVariables();
    if (routes.length === 1 && customizedGqlString) {
      gqlString = customizedGqlString;
    } else {
      gqlString = query.toGQL(key);
    }
    return client.query({
      query: gql`${gqlString}`,
      variables,
    })
  }

  const reset = (): Promise<*> => {
    return client.clearStore();
  }

  return {
    fetch,
    reset
  }
}

