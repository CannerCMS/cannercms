// @flow
import * as React from 'react';

export const defaultContext = {
  componentId: '',
  query: {},
  fetch: () => {throw new Error('there is no fetch method');},
  subscribe: () => {throw new Error('there is no subscribe method');},
  request: () => {throw new Error('there is no request method');},
  deploy: () => {throw new Error('there is no deploy method');},
  reset: () => {throw new Error('there is not reset method');}
}

export const HOCContext = React.createContext(defaultContext);
