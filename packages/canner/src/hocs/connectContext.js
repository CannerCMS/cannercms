// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {HOCContext} from './context';
import type {Query} from '../query';
import type {HOCProps, Reset} from './types';

type State = {
  canRender: boolean,
  refId: RefId
};

export default function connectContext(Com: React.ComponentType<*>) {
  return class ComponentConnectContext extends React.Component<HOCProps, State> {
    refId: RefId;
    query: Query;
    reset: Reset;

    render() {
      return <HOCContext.Consumer>
        {context => (
          <Com {...this.props}
            query={context.query}
            dataChanged={context.dataChanged}
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
