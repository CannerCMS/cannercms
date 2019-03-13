// @flow

import React, {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {Context} from 'canner-helpers';
import RefId from 'canner-ref-id';
// import Toolbar from '../toolbar';
// const AddButton = () => null;
export default function ListForm({
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
  ...props
}: any) {
  const contextValue = {
    rootValue,
    data,
    routes,
    routerParams,
    goTo,
    request,
    query,
    deploy,
    updateQuery,
    ...props
  }
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
          defaultKey,
          contextValue
        })
      )}
    </Context.Provider>
  )
}