// @flow

import * as React from 'react';
import {Context} from 'canner-helpers';
import type {HOCProps} from './types';

// $FlowFixMe
export default function withContainerRouter(Com: React.ComponentType<*>) {
  return class ContainerWithRouter extends React.Component<HOCProps> {
    render() {
      const {routes, renderChildren, refId} = this.props;
      return <Context.Provider
        value={{
          renderChildren,
          routes,
          refId
        }}
      >
        <Com {...this.props}/>
      </Context.Provider>;
    }
  };
}