// @flow

import {useRef, useEffect} from 'react';
import gql from 'graphql-tag';
import mapValues from 'lodash/mapValues';
import isEmpty from 'lodash/isEmpty';
import type { ApolloClient } from 'apollo-boost';

export default ({
  gqlMap,
  schema,
  client,
  routes,
  routerParams,
  variables
}: {
  gqlMap: Object,
  schema: Object,
  client: ApolloClient,
  routes: Array<string>,
  routerParams: Object,
  variables: Object
}) => {
  const [rootKey] = routes;
  const getObservable = ({
    key,
    fetchPolicy,
    variables
  }: {
    key: string,
    fetchPolicy: string,
    variables: Object
  }) => {
    return client.watchQuery({
      query: gql`${gqlMap[key]}`,
      variables,
      fetchPolicy
    });
  }

  const observableQueryMapRef = useRef(mapValues(schema, (v, key) => {
    if (routes[0] === key) {
      const fetchPolicy = routes.length > 1 && routerParams.operator === 'update' ? schema[key].fetchPolicy : 'cache-first'
      return getObservable({
        key,
        fetchPolicy,
        variables
      });
    }
    return getObservable({
      key,
      variables,
      fetchPolicy: 'cache-first'
    });
  }));

  useEffect(() => {
    // if there is ther customized graphql string,
    // we should update the observable query because the "LIST query" is different from "UPDATE query"
    const key = routes[0];
    const customizedGQL = schema[key] && schema[key].graphql;
    if (customizedGQL) {
      observableQueryMapRef.current[key] = getObservable({
        key,
        fetchPolicy: routes.length > 1 && routerParams.operator === 'update' ? schema[key].fetchPolicy : 'cache-first',
        variables
      });
    }
  }, [routes, routerParams.operator, variables]);

  const fetch = (key: string): Promise<*> => {
    const observabale = observableQueryMapRef.current[key];
    const currentResult = observabale.currentResult();
    const {loading, error} = currentResult;
    if (loading) {
      return observabale.result()
        .then(result => {
          return result;
        })
    } else if (error) {
      const lastResult = observabale.getLastResult();
      return Promise.resolve(lastResult);
    } else {
      return Promise.resolve(currentResult);
    }
  }

  const subscribe = (key: string, callback: (data: any) => void) => {
    const observableQuery = observableQueryMapRef.current[key];
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
  };

  const reset = (key?: string) => {
    if (observableQueryMapRef.current[(key || rootKey)]) {
      return observableQueryMapRef.current[key || rootKey].refetch(variables);
    }
  }

  const updateQuery = (paths: Array<string>, reWatchQuery: boolean, variables: Object) => {
    const [key] = paths;
    observableQueryMapRef.current[key] = getObservable({
      key,
      fetchPolicy: routes.length > 1 && routerParams.operator === 'update' ? schema[key].fetchPolicy : 'cache-first',
      variables
    });
    return Promise.resolve(reWatchQuery);
  };

  return {
    fetch,
    subscribe,
    reset,
    updateQuery
  }
}

