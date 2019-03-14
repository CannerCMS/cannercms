import React from 'react';
import {Context} from 'canner-helpers';

export default function Page({
  data,
  rootValue,
  componentTree,
  children,
  // toolbar,
  // onClickAddButton,
  routes,
  routerParams,
  goTo,
  request,
  query,
  deploy,
  updateQuery,
  // items,
  // args,
  ...props
}) {
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
    renderConfirmButton: () => null,
    renderCancelButton: () => null,
    ...props
  }
  return (
    <Context.Provider value={contextValue}>
      {React.cloneElement(children, {
        componentTree,
        goTo,
        routes,
        routerParams: routerParams || {},
        contextValue
      })}
    </Context.Provider>
  )
}