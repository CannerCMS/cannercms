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

    constructor(props: Props) {
      super(props);
      const {refId, name} = props;
      // these four values are pass by HOCs,
      // so give them a default value
      this.refId = refId ? refId.child(name) : new RefId(name);
    }

    render() {
      return <HOCContext.Consumer>
        {context => (
          <Com {...this.props}
            refId={this.refId}
            componentId={context.componentId || this.refId.toString()}
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