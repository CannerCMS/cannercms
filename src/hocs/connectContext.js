// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {HOCContext} from './context';
import type {Query} from '../query';

type Props = {
  refId: RefId,
  keyName: string,
  routes: Array<string>,
  pattern: string,
  params: Object,
  request: Function,
  items: Object,
  fetch: Function
};

type State = {
  canRender: boolean,
  refId: RefId
};

export default function connectContext(Com: React.ComponentType<*>) {
  return class ComponentConnectContext extends React.Component<Props, State> {
    refId: RefId;
    query: Query;
    reset: ResetDef;

    render() {
      return <HOCContext.Consumer>
        {context => (
          <Com {...this.props}
            query={context.query}
            reset={context.reset}
            fetch={context.fetch}
            subscribe={context.subscribe}
            request={context.request}
            deploy={context.deploy}
            updateQuery={context.updateQuery}
            onDeploy={context.onDeploy}
            removeOnDeploy={context.removeOnDeploy}
          />
        )}
      </HOCContext.Consumer>
    }
  };
}
