// @flow

import { useEffect, useReducer } from 'react';
import type RefId from 'canner-ref-id';
import { isCompleteContain, genPaths } from '../utils/renderType';

type Props = {
  pattern: string,
  path: string,
  hideBackButton?: boolean,
  refId: RefId,
  hideButtons: boolean,
  routes: Array<string>,
  routerParams: {operator: 'update' | 'create'}
};

export const RENDER_TYPE = {
  CHILDREN: 'CHILDREN',
  NULL: 'NULL',
  COMPONENT: 'COMPONENT',
};

export default ({
  pattern,
  path,
  hideBackButton = false,
  refId,
  hideButtons,
  routes,
  routerParams: { operator }
}: Props) => {
  const [state, dispatch] = useReducer(reducer, getValues({
    routes,
    path,
    pattern,
    operator,
    hideBackButton,
    hideButtons,
    refId,
    routerParams: { operator }
  }));

  useEffect(() => {
    const newValues = getValues({
      routes,
      path,
      pattern,
      operator,
      hideBackButton,
      hideButtons,
      refId,
      routerParams: { operator }
    });
    dispatch({
      type: 'update_state',
      payload: newValues
    });
  }, [JSON.stringify(routes), pattern, path, operator]);

  return state;
};


export function getSubmitAndCancelButtons({
  pattern,
  hideButtons,
  routes,
  operator,
}: {
  pattern: string,
  hideButtons: boolean,
  routes: Array<string>,
  refId: RefId,
  operator: string
}) {
  const isCreateView = operator === 'create';
  const isFirstArray = pattern === 'array';
  const isUpdateView = routes.length === 2;

  const shouldRenderButtons = (isFirstArray && (isUpdateView || isCreateView)) && !hideButtons;
  return shouldRenderButtons;
}

export function getShowListButton({
  hideBackButton = false,
  pattern,
  routes,
  refId,
  operator,
}: {
  hideBackButton?: boolean,
  pattern: string,
  routes: Array<string>,
  refId: RefId,
  operator: string
}) {
  const routesLength = routes.length;
  const pathArrLength = refId.getPathArr().length;
  return !hideBackButton && pattern === 'array' && (routesLength === pathArrLength || (routesLength + 1 === pathArrLength && operator === 'create'));
}

export function getRenderType({
  routes,
  path,
  pattern,
  operator,
}: {
  routes: Array<string>,
  path: string,
  pattern: string,
  operator: string
}) {
  if (!pattern && !path) {
    // layout
    return RENDER_TYPE.COMPONENT;
  }
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
  } if (type === 'array') {
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
  }
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

type State = {
  renderType: $Values<typeof RENDER_TYPE>,
  showListButton: boolean,
  showSubmitAndCancelButtons: boolean
};

type Action = {
  type: 'change_render_type',
  payload: $Values<typeof RENDER_TYPE>
} | {
  type: 'toggle_list_button'
} | {
  type: 'toggle_submit_cancel_button'
} | {
  type: 'update_state',
  payload: State
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'change_render_type': {
      return { ...state, renderType: action.payload };
    }
    case 'toggle_list_button': {
      return { ...state, showListButton: !state.showListButton };
    }
    case 'toggle_submit_cancel_button': {
      return { ...state, showListButton: !state.showSubmitAndCancelButtons };
    }
    case 'update_state': {
      return action.payload;
    }
    default:
      return state;
  }
}

function getValues({
  routes,
  path,
  pattern,
  operator,
  hideBackButton,
  refId,
  hideButtons
}: Props & {
  operator: 'update' | 'create',
}) {
  return {
    renderType: getRenderType({
      routes,
      path,
      pattern,
      operator,
    }),
    showListButton: getShowListButton({
      hideBackButton,
      pattern,
      routes,
      refId,
      operator,
    }),
    showSubmitAndCancelButtons: getSubmitAndCancelButtons({
      pattern,
      hideButtons,
      routes,
      refId,
      operator,
    })
  };
}
