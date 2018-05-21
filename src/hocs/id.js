// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {HOCContext} from './context';
import type {Query} from '../query';

type Props = {
  refId: RefId,
  keyName: string,
  routes: Array<string>,
  pattern: string
};

export default function connectIdAndContext(Com: React.ComponentType<*>) {
  return class ComponentConnectIdAndContext extends React.Component<Props> {
    refId: RefId;
    query: Query;
    reset: ResetDef;

    render() {
      const {refId, keyName, routes, pattern} = this.props;
      let myRefId = refId;
      // route to children
      if (isChildrenOfArray(pattern) && routes.length > 1 && refId.getPathArr().length === 1) {
        myRefId = refId.child(routes[1]);
      }
      myRefId = myRefId ? myRefId.child(keyName) : new RefId(keyName);
      return <HOCContext.Consumer>
        {context => (
          <Com {...this.props}
            refId={myRefId}
            query={context.query}
            reset={context.reset}
            fetch={context.fetch}
            subscribe={context.subscribe}
            request={context.request}
            deploy={context.deploy}
            updateQuery={context.updateQuery}
          />
        )}
      </HOCContext.Consumer>
    }
  };
}

function isChildrenOfArray(pattern: string) {
  const patternArray = pattern.split('.');
  return patternArray.length === 2 && patternArray[0] === 'array';
}