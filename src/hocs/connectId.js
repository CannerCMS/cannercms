// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import RefId from 'canner-ref-id';

type Props = {
  refId: RefId,
  name: string,
};

type Context = {
  componentId?: string,
  query?: QueryDef,
  fetch: FetchDef,
  subscribe: SubscribeDef,
  request: RequestDef,
  deploy: DeployDef,
  reset?: ResetDef
}

export default function connectIdAndContext(Com: React.ComponentType<*>) {
  return class ComponentConnectIdAndContext extends React.Component<Props> {
    refId: RefId;
    componentId: string;
    query: QueryDef;
    reset: ResetDef;

    static contextTypes = {
      componentId: PropTypes.string,
      query: PropTypes.shape({
        filter: PropTypes.object,
        sort: PropTypes.object,
        order: PropTypes.object,
      }),

      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      request: PropTypes.func,
      deploy: PropTypes.func,
      reset: PropTypes.func,
    }

    constructor(props: Props, context: Context) {
      super(props);
      const {refId, name} = props;
      const {componentId, query, reset} = context;
      // these four values are pass by HOCs,
      // so give them a default value
      this.refId = refId ? refId.child(name) : new RefId(name);
      this.componentId = componentId || this.refId.toString();
      // $FlowFixMe
      this.query = query || {};
      this.reset = reset || (() => Promise.resolve());
    }

    render() {
      return <Com {...this.props}
        refId={this.refId}
        componentId={this.componentId}
        query={this.query}
        reset={this.reset}
        fetch={this.context.fetch}
        subscribe={this.context.subscribe}
        request={this.context.request}
        deploy={this.context.deploy}
      />;
    }
  };
}