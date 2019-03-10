// @flow

import {useContext, useState, useRef, useEffect} from 'react';
import {Context} from 'canner-helpers';
import {mapValues} from 'lodash';
import {getEmptyValue, getFieldValue} from '../utils/value';
import type RefId from 'canner-ref-id';

export default function({
  type,
  relation,
  subscribe,
  fetch,
  updateQuery,
  refId,
  path,
  pattern
}: {
  type: string,
  relation: any,
  subscribe: Function,
  fetch: Function,
  updateQuery: Function,
  refId: RefId,
  path: string,
  pattern: string
}) {
  const {routes, query} = useContext(Context);
  const firstKey = routes[0];
  const [fetching, setFetching] = useState(true);
  const [value, setValue] = useState(() => getEmptyValue({
    type,
    relation,
  }));
  const [rootValue, setRootValue] = useState({});
  const [data, setData] = useState({});
  const subscriptionRef = useRef(null);
  const updateData = (data: any, rootValue: any) => {
    const newValue = getFieldValue(rootValue, refId.getPathArr());
    setRootValue(rootValue);
    setValue(newValue);
    setData(data);
    setFetching(false);
  };
  const queryData = (): Promise<*> => {
    setFetching(true);
    return fetch(firstKey).then(result => {
      const {data, rootValue} = result;
      updateData(data, rootValue);
    });
  };
  const _subscribe = () => {
    subscriptionRef.current = subscribe(firstKey, result => {
      const {data, rootValue} = result;
      updateData(data, rootValue);
    });
  };
  const unsubscribe = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
  }

  const _updateQuery = (paths: Array<string>, args: Object) => {
    return updateQuery(paths, args)
      .then(rewatch => {
        if (rewatch) {
          unsubscribe();
          queryData()
            .then(_subscribe);
        } else {
          queryData();
        }
      })
  };

  const getArgs = () => {
    if (pattern !== 'array')
      return {}
    const queries = query.getQueries(path.split('/')).args || {pagination: {first: 10}};
    const variables = query.getVariables();
    const args = mapValues(queries, v => variables[v.substr(1)]);
    return args;
  }

  const isUpdateView = routes.length > 1;
  const isFirstArray = pattern === 'array';

  // when refId changes, we should get new value
  useEffect(() => {
    unsubscribe();
    const args = getArgs();
    if (isUpdateView && isFirstArray) {
      args.where = {
        id: routes[1]
      };
    } else {
      if (args.where && args.where.id) {
        delete args.where.id;
      }
    }
    _updateQuery(refId.getPathArr().slice(0, 1), args)
      .then(queryData)
      .then(_subscribe)
    return unsubscribe;
  }, [refId.toString()]);

  return {
    rootValue,
    originRootValue: data,
    value,
    fetching,
    updateToolbarQuery: _updateQuery,
    args: getArgs()
  }
}
