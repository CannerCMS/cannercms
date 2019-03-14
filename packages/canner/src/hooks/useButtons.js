// @flow
import React, {useContext} from 'react';
import {Context} from 'canner-helpers';
import {isArray} from 'lodash';
import {Button} from 'antd';
import {isRoutesEndAtMe} from '../utils/renderType';
import type RefId from 'canner-ref-id';

type ButtonProps = {
  disabled?: boolean,
  style?: Object,
  refId?: RefId,
  onClick?: (refId?: RefId, callback?: Function) => Promise<*>,
  callback?: Function,
  text?: any,
  hidden?: boolean,
  Component?: any
}

export default ({
  deploy,
  reset,
  rootValue,
  refId,
  controlDeployAndResetButtons,
  hideButtons,
  path,
  pattern
}: {
  deploy: Function,
  reset: Function,
  rootValue: any,
  refId: RefId,
  controlDeployAndResetButtons: boolean,
  hideButtons: boolean,
  path: string,
  pattern: string
}) => {
  const {routes, routerParams} = useContext(Context);
  const _deploy = (refId: RefId, callback: Function) => {
    return deploy(refId.getPathArr()[0]).then(callback).catch(() => {});
  }

  const _reset = (refId: RefId, callback: Function) => {
    const key = refId.getPathArr()[0];
    const recordId = getItemId(rootValue, refId);
    reset(key, recordId);
    callback();
  }

  const renderSubmitButton = genDeployButton(_deploy, refId);
  const renderCancelButton = genCancelButton(_reset, refId);
  const isCreateView = routerParams.operator === 'create';
  const isFirstArray = pattern === 'array';
  const isUpdateView = routes.length === 2;
  const shouldRenderButtons = (isFirstArray && (isUpdateView || isCreateView)) && !hideButtons;
  return {
    renderSubmitButton,
    renderCancelButton,
    shouldRenderSubmitButton: shouldRenderButtons,
    shouldRenderCancelButton: shouldRenderButtons && !isCreateView
  }
}


export function genDeployButton(deploy: Function, currentRefId: RefId) {
  return function DeployButton({
    disabled = false,
    style = {marginRight: 16},
    refId = currentRefId,
    onClick = deploy,
    callback = () => {},
    text = 'Confirm',
    Component = Button
  }: ButtonProps = {}) {
    return <Component
      disabled={disabled}
      style={style}
      type="primary"
      onClick={() => onClick(refId, callback)}
      data-testid="confirm-button"
    >
      {text}
    </Component>;
  };
}

export function genCancelButton(reset: Function, currentRefId: RefId) {
  return function CancelButton({
    disabled = false,
    style = {},
    refId = currentRefId,
    onClick = reset,
    callback = () => {},
    text = 'Reset',
    Component = Button
  }: ButtonProps = {}) {
    return <Component
      disabled={disabled}
      style={style}
      onClick={() => onClick(refId, callback)}
      data-testid="reset-button"
    >
      {text}
    </Component>;
  };
}

function getItemId(rootValue: any, refId: RefId) {
  const [key, index] = refId.getPathArr();
  let itemId = '';
  const value = rootValue[key];
  if (isArray(value) && index) {
    itemId = value[index].id;
  }
  return itemId;
}
