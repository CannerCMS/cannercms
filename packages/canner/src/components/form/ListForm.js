// @flow

import React, {useState, useEffect, useContext, useRef} from 'react';
import {Context} from 'canner-helpers';
const AddButton = () => null;
const Generator = (props) => {
  console.log(props);
  return '123';
};
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
  ...props
}: any) {

  return (
    <Context.Provider
      value={{
        rootValue,
        data,
        routes,
        routerParams,
        goTo,
        ...props
      }}
    >
      <AddButton onClick={onClickAddButton}/>
      <Toolbar toolbar={toolbar}/>
      {isFetching ? loading : (
        <Generator
          componentTree={componentTree}
          goTo={goTo}
          routes={routes}
          routerParams={routerParams || {}}
          defaultKey={defaultKey}
        />
      )}
    </Context.Provider>
  )
}