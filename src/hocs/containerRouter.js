// @flow

import * as React from 'react';
import type RefId from 'canner-ref-id';
import {Context} from 'canner-helpers';

type Props = {
  childrenName: Array<string>,
  routes: Array<string>,
  renderChildren: Function,
  refId: RefId,
  nodeType: string,
};

// $FlowFixMe
export default function withContainerRouter(Com: React.ComponentType<*>) {
  return class ContainerWithRouter extends React.Component<Props> {
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