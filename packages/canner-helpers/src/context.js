import React from 'react';

export const defaultContext =  {
  routes: [],
  schema: Object,
  query: null,
  dataChanges: {},
  hideButtons: false,
  routerParams: {},
  imageStorage: null,
  fileStorage: null,
  refId: null,
  client: null
};

const functions = [
  'request',
  'deploy',
  'fetch',
  'goTo',
  'reset',
  'updateQuery',
  'subscribe',
  'unsubscribe',
  'onDeploy',
  'removeOnDeploy',
  'renderChildren',
  'renderComponent',
  'renderConfirmButton',
  'renderCancelButton'
];

functions.forEach(functionName => {
  defaultContext[functionName] = () => {
    throw new Error(`There is no ${functionName} method from Context`);
  }
})

function getContextFromWindow() {
  // fix in node env
  if (window) {
    window.__canner_item_contenxt__ = window.__canner_item_contenxt__ || React.createContext(defaultContext);
    return  window.__canner_item_contenxt__;
  }
  return {};
}

export default typeof window === 'undefined' ? React.createContext(defaultContext) : getContextFromWindow();

