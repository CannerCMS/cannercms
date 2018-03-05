// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MiniApp} from '@canner/restful-qa';
type Props = {
  id: string
};

// $FlowFixMe
export default function withMiniApp(Com: React$Component<*>) {
  return class ComponentWithMiniApp extends Component<Props> {
    app: MiniApp;
    static childContextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      request: PropTypes.func,
      deploy: PropTypes.func,
      reset: PropTypes.func,
    };

    getChildContext() {
      return {
        fetch: this.app.fetch,
        subscribe: this.app.subscribe,
        request: this.app.request,
        deploy: this.app.deploy,
        reset: this.app.reset,
      };
    }

    static contextTypes = {
      request: PropTypes.func,
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
    }

    constructor(props: Props, context: {request: Function, fetch: Function, subscribe: Function}) {
      super(props);
      this.app = new MiniApp({
        request: context.request,
        fetch: context.fetch,
        subscribe: context.subscribe,
      });
    }

    render() {
      const {id} = this.props;
      return <Com {...this.props} id={id} />;
    }
  };
}
