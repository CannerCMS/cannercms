// @flow

import {useContext, useState, useEffect} from 'react';
import {Context} from 'canner-helpers';
import {isCompleteContain, genPaths} from '../utils/renderType';
import type RefId from 'canner-ref-id';

export const RENDER_TYPE = {
  CHILDREN: 0,
  NULL: 1,
  COMPONENT: 2
}

export default ({
  pattern,
  path,
  hideBackButton,
}: {
  pattern: string,
  path: string,
  hideBackButton: boolean
}) => {
  const {hideButtons, routes, refId, routerParams: {operator}} = useContext(Context);
  const [renderType, setRenderType] = useState(() => getRenderType({
    routes,
    path,
    pattern,
    operator
  }));
  const [showListButton, setShowListButton] = useState(() => getShowListButton({
    hideBackButton,
    pattern,
    routes,
    refId,
    operator
  }));
  const [showSubmitAndCancelButtons, setSubmitAndCancelButtons] = useState(() => getSubmitAndCancelButtons({
    pattern,
    hideButtons,
    routes,
    refId,
    operator
  }));

  useEffect(() => {
    const renderType = getRenderType({
      routes,
      path,
      pattern,
      operator
    });
    setRenderType(renderType);
  }, [routes, pattern, path, operator]);

  useEffect(() => {
    const showListButton = getShowListButton({
      hideBackButton,
      pattern,
      routes,
      refId,
      operator
    });
    setShowListButton(showListButton);
  }, [hideBackButton, routes, pattern, refId.toString(), operator]);

  useEffect(() => {
    const showSubmitAndCancelButtons = getSubmitAndCancelButtons({
      pattern,
      hideButtons,
      routes,
      refId,
      operator
    });
    setSubmitAndCancelButtons(showSubmitAndCancelButtons);
  }, [routes, pattern, hideButtons, refId.toString(), operator]);

  return {
    renderType,
    showListButton,
    showSubmitAndCancelButtons
  }
}


export function getSubmitAndCancelButtons({
  pattern,
  hideButtons,
  routes,
  refId,
  operator
}: {
  pattern: string,
  hideButtons: boolean,
  routes: Array<string>,
  refId: RefId,
  operator: string
}) {
  const routesLength = routes.length;
  const pathArrLength = refId.getPathArr().length;
  const isCreateView = operator === 'create';
  const isFirstArray = pattern === 'array';
  const isUpdateView = routes.length === 2;

  const shouldRenderButtons = (isFirstArray && (isUpdateView || isCreateView)) && !hideButtons;
  return shouldRenderButtons
}

export function getShowListButton({
  hideBackButton,
  pattern,
  routes,
  refId,
  operator
}: {
  hideBackButton: boolean,
  pattern: string,
  routes: Array<string>,
  refId: RefId,
  operator: string
}) {
  const routesLength = routes.length;
  const pathArrLength = refId.getPathArr().length;
  return !hideBackButton && pattern === 'array' && (routesLength === pathArrLength || (routesLength + 1 === pathArrLength && operator === 'create'))
}

export function getRenderType({
  routes,
  path,
  pattern,
  operator
}: {
  routes: Array<string>,
  path: string,
  pattern: string,
  operator: string
}) {
  const paths = genPaths(path, pattern);
  const pathsLength = paths.length;
  const routesLength = routes.length;
  if (routes[0] !== paths[0]) {
    return RENDER_TYPE.NULL;
  }
  const type = pattern.split('.').slice(-1)[0];
  if (type === 'object') {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_TYPE.COMPONENT;
    }
    if (routesLength < pathsLength) {
      return RENDER_TYPE.COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_TYPE.CHILDREN;
    }
    return RENDER_TYPE.NULL;
  } else if (type === 'array') {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_TYPE.CHILDREN;
    }
    if (routesLength < pathsLength) {
      if (routesLength === pathsLength - 1 && operator === 'create') {
        return RENDER_TYPE.CHILDREN;
      }
      return RENDER_TYPE.COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_TYPE.COMPONENT;
    }
    return RENDER_TYPE.NULL;
  } else {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_TYPE.NULL;
    }
    if (routesLength < pathsLength) {
      return RENDER_TYPE.COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_TYPE.COMPONENT;
    }
    return RENDER_TYPE.NULL;
  }
}
