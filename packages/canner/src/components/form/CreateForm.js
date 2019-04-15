// @flow

import React, {useMemo} from 'react';
import {Context} from 'canner-helpers';

const BackButton = () => null;
const SubmitButton = () => null;
const CancelButton = () => null;
export default function CreateForm(props: any) {
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
  }), [routes, routerParams, rootValue]);
  // TODO: move buttons from HOC to here
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
        })
      )}
      <SubmitButton onClick={onClickSubmitButton}>submit</SubmitButton>
      <CancelButton onClick={onClickCancelButton}>cancel</CancelButton>
    </Context.Provider>
  )
}