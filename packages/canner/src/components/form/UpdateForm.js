// @flow

import React, {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {Context} from 'canner-helpers';
const BackButton = () => null;
const SubmitButton = () => null;
const CancelButton = () => null;
export default function UpdateForm(props: any) {
  const {
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
  return (
    <Context.Provider value={contextValue}>
      <BackButton onClick={onClickBackButton}>BackButton</BackButton>
      {isFetching ? loading : (
        React.cloneElement(children, {
          componentTree,
          goTo,
          routes,
          routerParams: routerParams || {},
          defaultKey
        })
      )}
      <SubmitButton onClick={onClickSubmitButton}>submit</SubmitButton>
      <CancelButton onClick={onClickCancelButton}>cancel</CancelButton>
    </Context.Provider>
  )
}