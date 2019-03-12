// @flow

import React, {useState, useEffect, useContext, useRef} from 'react';
import {Context} from 'canner-helpers';
const BackButton = () => null;
const SubmitButton = () => null;
const CancelButton = () => null;
export default function UpdateForm({
  data,
  rootValue,
  loading = null,
  isFetching,
  onClickBackButton,
  onClickSubmitButton,
  onClickCancelButton,
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
      <BackButton onClick={onClickBackButton}>BackButton</BackButton>
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
      <SubmitButton onClick={onClickSubmitButton}>submit</SubmitButton>
      <CancelButton onClick={onClickCancelButton}>cancel</CancelButton>
    </Context.Provider>
  )
}