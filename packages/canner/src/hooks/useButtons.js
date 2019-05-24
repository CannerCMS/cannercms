// @flow
import { useContext } from 'react';
import { Context } from 'canner-helpers';
import type RefId from 'canner-ref-id';

export default ({
  hideButtons,
  pattern,
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
  const { routes, routerParams } = useContext(Context);
  const isCreateView = routerParams.operator === 'create';
  const isFirstArray = pattern === 'array';
  const isUpdateView = routes.length === 2;
  const shouldRenderButtons = (isFirstArray && (isUpdateView || isCreateView)) && !hideButtons;
  return {
    shouldRenderSubmitButton: shouldRenderButtons,
    shouldRenderCancelButton: shouldRenderButtons && !isCreateView,
  };
};
