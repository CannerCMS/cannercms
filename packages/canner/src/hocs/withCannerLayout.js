// @flow

import React, { useContext, useMemo } from 'react';
import { Context } from 'canner-helpers';
import { isFunction, isEqual } from 'lodash';
// hooks
import useRefId from '../hooks/useRefId';
import useOnChange from '../hooks/useOnChange';
import useRecordValue from '../hooks/useRecordValue';

export default function withCannerLayout(Com: any) {
  return (React.memo: any)((props: any) => {
    const {
      pattern,
      keyName,
      renderChildren,
      refId,
      nodeType
    } = props;
    const contextValue = useContext(Context);
    const {
      rootValue,
      request,
      routes,
      routerParams,
      schema
    } = contextValue;
    const myRefId = useRefId({
      nodeType,
      pattern,
      keyName,
      refId,
      routes,
      routerParams
    });
    const { onChange } = useOnChange({ rootValue, request, schema });
    const { recordValue } = useRecordValue({ rootValue, refId });
    const myContextValue = useMemo(() => ({
      ...contextValue,
      refId: myRefId,
      renderChildren,
    }), [myRefId.toString(), recordValue, rootValue]);
    return (
      <Context.Provider value={myContextValue}>
        <Com
          {...props}
          {...myContextValue}
          recordValue={recordValue}
          refId={myRefId}
          onChange={onChange}
        />
      </Context.Provider>
    );
  }, (prevProps, nextProps) => Object.entries(nextProps).reduce((eq, [k, v]: any) => {
    if (isFunction(v)) {
      return eq;
    }
    if (k === 'refId') {
      return eq && prevProps[k].toString() === v.toString();
    }
    return isEqual(v, prevProps[k]) && eq;
  }, true));
}
