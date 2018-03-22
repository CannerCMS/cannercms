// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
  id: string,
  name: string,
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  [string]: any
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
    id: string;
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
      rootValue: PropTypes.ant,

      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      request: PropTypes.func,
      deploy: PropTypes.func,
      reset: PropTypes.func,
    }

    /**
    |--------------------------------------------------
    | because componentId is public in a entity
    |--------------------------------------------------
    */
    static childContextTypes = {
      componentId: PropTypes.string
    }

    getChildContext() {
      return {
        componentId: this.componentId
      };
    }

    constructor(props: Props, context: Context) {
      super(props);
      const {id, name} = props;
      const {componentId, query, reset} = context;
      this.id = `${id ? id + '/' : ''}${name}`;
      this.componentId = componentId || id;
      // $FlowFixMe
      this.query = query || {};
      this.reset = reset || (() => Promise.resolve());
    }

    render() {
      return <Com {...this.props}
        id={this.id}
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