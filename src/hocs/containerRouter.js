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
      const {routes, childrenName, renderChildren, refId, nodeType} = this.props;
      return <Context.Provider
        value={{
          renderChildren,
          refId
        }}
      >
        {
          // no need to filter any container so just render
          (nodeType === 'container.body' || routes.length === 0) && <Com {...this.props}/>
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
          (routes.length && childrenName.length && childrenName.indexOf(routes[0]) !== -1) && <Com {...this.props}/>
        }
      </Context.Provider>;
      // no need to filter any container so just render
      // if (nodeType === 'container.body' || routes.length === 0) {
      //   return <Com {...this.props}/>;
      // }

      // // the route points on this container so  render it!
      // if (routes.length === 1 && childrenName.length === 1 && routes[0] === childrenName[0]) {
      //   return <Com {...this.props}/>;
      // }

      // // the route points on the children of this container, so render children!
      // if (routes.length > 1 && childrenName.length && routes[0] === childrenName[0]) {
      //   return <div>{renderChildren({refId, routes})}</div>;
      // }

      // // in container's children
      // if (routes.length && childrenName.length && childrenName.indexOf(routes[0]) !== -1) {
      //   return <Com {...this.props}/>;
      // }

      // return null;
    }
  };
}