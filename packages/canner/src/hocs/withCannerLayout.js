// @flow

import React, {useContext, useMemo, useCallback, useDebugValue} from 'react';
import {Context} from 'canner-helpers';

// hooks
import useRefId from '../hooks/useRefId';
import useOnChange from '../hooks/useOnChange';

export default function withCannerLayout(Com: any) {
  return function LayoutWithCanner(props: any) {
    const {
      pattern,
      keyName,
      renderChildren
    } = props;
    const contextValue = useContext(Context);
    const {
      rootValue,
      request,
      refId
    } = contextValue;
    const myRefId = useRefId({pattern, keyName, refId});
    const {onChange} = useOnChange({rootValue, request});
    const myContextValue = {
      ...contextValue,
      refId: myRefId,
      renderChildren
    };
    return (
      <Context.Provider value={myContextValue}>
        <Com
          {...props}
          {...contextValue}
          refId={myRefId}
          onChange={onChange}
        />
      </Context.Provider>
    )
  }
}
