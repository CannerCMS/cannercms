// @flow

import React, {useMemo} from 'react';
import {Context} from 'canner-helpers';
export default function UpdateForm(props: any) {
  const {
    data,
    rootValue,
    loading = null,
    isFetching,
    componentTree,
    routes,
    routerParams,
    goTo,
    defaultKey,
    children,
    ...rest
  } = props;
  const contextValue = useMemo(() => ({
    rootValue,
    data,
    routes,
    routerParams,
    goTo,
    ...rest
  }), [data, routes]);
  // TODO: move buttons from HOC to here
  return (
    <Context.Provider value={contextValue}>
      {isFetching ? loading : (
        React.cloneElement(children, {
          componentTree,
          goTo,
          routes,
          routerParams: routerParams || {},
          defaultKey
        })
      )}
    </Context.Provider>
  )
}