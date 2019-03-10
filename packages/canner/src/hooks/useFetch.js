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
      console.log(firstKey, result);
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
    updateQuery(paths, args)
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

  useEffect(() => {
    unsubscribe();
    queryData()
      .then(_subscribe);
    return unsubscribe;
  }, [refId.toString()]);
  const getArgs = () => {
    if (pattern !== 'array')
      return {}
    const queries = query.getQueries(path.split('/')).args || {pagination: {first: 10}};
    const variables = query.getVariables();
    const args = mapValues(queries, v => variables[v.substr(1)]);
    return args;
  }

  return {
    rootValue,
    originRootValue: data,
    value,
    fetching,
    updateToolbarQuery: _updateQuery,
    args: getArgs()
  }
}
