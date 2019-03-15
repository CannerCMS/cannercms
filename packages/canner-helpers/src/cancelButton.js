// @flow
import React, {useContext} from 'react';
import Context from './context';
import {Button} from 'antd';
import type RefId from 'canner-ref-id';

export default function CancelButton({
  disabled,
  style,
  callback = () => {},
  text = 'Cancel'
}: any) {
  const contextValue = useContext(Context);
  const {reset, refId} = contextValue;
  const onClick = (refId: RefId, callback: Function) => {
    const key = refId.getPathArr()[0];
    reset(key).then(callback);
  }
  return <Button
    disabled={disabled}
    style={style}
    onClick={() => onClick(refId, callback)}
    data-testid="reset-button"
  >
    {text}
  </Button>;
}
