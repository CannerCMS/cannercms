// @flow

import * as React from 'react';
import type RefId from 'canner-ref-id';
import {Context} from '@canner/react-cms-helpers';

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
      const {routes, childrenName, renderChildren, refId} = this.props;
      return <Context.Provider
        value={{
          renderChildren,
          routes,
          refId
        }}
      >
        {
          // no need to filter any container so just render
          (routes.length === 0) && <Com {...this.props}/>
        }
        {
          // the route points on this container so  render it!
          (routes.length === 1 && childrenName.length === 1 && routes[0] === childrenName[0]) && <Com {...this.props}/>
        }
        {
          // the route points on the children of this container, so render children!
          (routes.length > 1 && childrenName.length && routes[0] === childrenName[0]) && <div>{renderChildren({refId, routes})}</div>
        }
        {
          // in container's children
          Boolean(routes.length && childrenName.length && (routes[0] !== childrenName[0]) && (childrenName.indexOf(routes[0]) !== -1)) && <Com {...this.props}/>
        }
      </Context.Provider>;
    }
  };
}