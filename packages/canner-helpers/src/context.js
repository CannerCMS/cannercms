import React from 'react';

export const defaultContext =  {
  renderChildren: () => {throw new Error('There is no renderChildren method')},
  renderConfirmButton: () => {throw new Error('There is no renderConfirmButton method')},
  renderCancelButton: () => {throw new Error('There is no renderCancelButton method')},
  renderComponent: () => {throw new Error('There is no renderComponent method')},
  refId: null,
  routes: null,
};

function getContextFromWindow() {
  if (window) {
    window.__canner_item_contenxt__ = window.__canner_item_contenxt__ || React.createContext(defaultContext);
    return  window.__canner_item_contenxt__;
  }
  return {};
}

export default typeof window === 'undefined' ? React.createContext(defaultContext) : getContextFromWindow();

