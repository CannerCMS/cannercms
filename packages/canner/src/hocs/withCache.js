// @flow
import React, { useMemo, useContext } from 'react';
import { Context } from 'canner-helpers';
import useCacheMethods from '../hooks/useMethods';

export default function withCache(Com: any) {
  return function ComWithCache(props: any) {
    const contextValue = useContext(Context);
    const {
      changedData,
      reset,
      request,
      onDeploy,
      removeOnDeploy,
      deploy,
      data,
      rootValue,
    } = useCacheMethods(props);
    const myContextValue = useMemo(() => ({
      ...contextValue,
      changedData,
      reset,
      request,
      onDeploy,
      removeOnDeploy,
      deploy,
      data,
      rootValue,
    }), [data, rootValue]);
    const renderChildrenWithCacheMethods = (...args) => (
      <Context.Provider value={myContextValue}>
        {/* eslint-disable-next-line */}
        {props.renderChildren(...args)}
      </Context.Provider>
    );
    return (
      <Context.Provider value={{ ...contextValue, deploy, reset }}>
        <Com {...props} renderChildren={renderChildrenWithCacheMethods} />
      </Context.Provider>
    );
  };
}
