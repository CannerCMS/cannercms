// @flow

import React, {useState, useEffect, useContext, useRef} from 'react';
import {Context} from 'canner-helpers';
const AddButton = () => null;
const Toolbar = () => null;
export default function ListForm({
  data,
  rootValue,
  loading = null,
  isFetching,
  toolbar,
  onClickAddButton,
  componentTree,
  routes,
  routerParams,
  goTo,
  defaultKey,
  children,
  ...props
}: any) {
  const contextValue = {
    rootValue,
    data,
    routes,
    routerParams,
    goTo,
    ...props
  }
  return (
    <Context.Provider value={contextValue}>
      <AddButton onClick={onClickAddButton}/>
      <Toolbar toolbar={toolbar}/>
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