// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {HOCContext} from './context';

type Props = {
  refId: RefId,
  keyName: string
};

export default function connectIdAndContext(Com: React.ComponentType<*>) {
  return class ComponentConnectIdAndContext extends React.Component<Props> {
    refId: RefId;
    query: QueryDef;
    reset: ResetDef;

    render() {
      const {refId, keyName} = this.props;
      const myRefId = refId ? refId.child(keyName) : new RefId(keyName);
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
          />
        )}
      </HOCContext.Consumer>
    }
  };
}