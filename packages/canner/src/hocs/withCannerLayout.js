// @flow

import React, {useContext, useMemo, useCallback, useDebugValue} from 'react';
import {Context} from 'canner-helpers';

// hooks
import useRefId from '../hooks/useRefId';
import useOnChange from '../hooks/useOnChange';
import useRecordValue from '../hooks/useRecordValue';

export default function withCannerLayout(Com: any) {
  return function LayoutWithCanner(props: any) {
    const {
      pattern,
      keyName,
      renderChildren,
      refId
    } = props;
    const contextValue = useContext(Context);
    const {
      rootValue,
      request
    } = contextValue;
    const myRefId = useRefId({pattern, keyName, refId});
    const {onChange} = useOnChange({rootValue, request});
    const {recordValue} = useRecordValue({rootValue, refId});
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
          recordValue={recordValue}
          refId={myRefId}
          onChange={onChange}
        />
      </Context.Provider>
    )
  }
}
