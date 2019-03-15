// @flow

import React, {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {Context} from 'canner-helpers';
import {isEqual} from 'lodash';
import RefId from 'canner-ref-id';
// import Toolbar from '../toolbar';
// const AddButton = () => null;
export default React.memo(function ListForm(props: any) {
  const {
    data,
    rootValue,
    loading = null,
    isFetching,
    // toolbar,
    // onClickAddButton,
    componentTree,
    routes,
    routerParams,
    goTo,
    defaultKey,
    children,
    request,
    query,
    deploy,
    updateQuery,
    // items,
    // args,
    ...rest
  } = props;
  const contextValue = useMemo(() => ({
    rootValue,
    data,
    routes,
    routerParams,
    goTo,
    request,
    query,
    deploy,
    updateQuery,
    ...rest
  }), [rootValue, data, routes, routerParams, goTo])
  // const keyName = routes[0];
  // const refId = useMemo(() => new RefId(keyName), [keyName]);
  return (
    <Context.Provider value={contextValue}>
      {/* <AddButton onClick={onClickAddButton}/> */}
      {/* <Toolbar
        items={items}
        toolbar={toolbar}
        args={args}
        query={query}
        refId={refId}
        keyName={keyName}
        originRootValue={data}
        rootValue={rootValue}
        updateQuery={updateQuery}
        request={request}
        deploy={deploy}
      /> */}
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
}, function(prevProps, nextProps) {
  return Object.entries(nextProps).reduce((eq, [k, v]: any) => {
    if (k === 'refId') {
      return eq && prevProps[k].toString() === v.toString();
    }
    return isEqual(v, prevProps[k]) && eq;
  }, true)
})