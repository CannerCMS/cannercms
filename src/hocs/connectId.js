// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {HOCContext} from './context';

type Props = {
  refId: RefId,
  name: string
};

export default function connectIdAndContext(Com: React.ComponentType<*>) {
  return class ComponentConnectIdAndContext extends React.Component<Props> {
    refId: RefId;
    componentId: string;
    query: QueryDef;
    reset: ResetDef;

    render() {
      const {refId, name} = this.props;
      const myRefId = refId ? refId.child(name) : new RefId(name);
      return <HOCContext.Consumer>
        {context => (
          <Com {...this.props}
            refId={myRefId}
            componentId={context.componentId || myRefId.toString()}
            query={context.query}
            reset={context.reset}
            fetch={context.fetch}
            subscribe={context.subscribe}
            request={context.request}
            deploy={context.deploy}
          />
        )}
      </HOCContext.Consumer>
    }
  };
}