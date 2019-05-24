// @flow
import React, { useContext } from 'react';
import { Button } from 'antd';
import type RefId from 'canner-ref-id';
import Context from './context';

export default function ConfirmButton({
  disabled,
  style,
  callback = () => {},
  text = 'Submit',
}: any) {
  const contextValue = useContext(Context);
  const { deploy, refId } = contextValue;
  const onClick = (refId: RefId, callback: Function) => {
    const key = refId.getPathArr()[0];
    return deploy(key)
      .then(callback)
      .catch(() => {});
  };
  return (
    <Button
      data-testid="confirm-button"
      disabled={disabled}
      type="primary"
      style={style}
      onClick={() => onClick(refId, callback)}
    >
      {text}
    </Button>
  );
}
