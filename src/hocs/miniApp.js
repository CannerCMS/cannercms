// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {MiniApp} from '../app';

type Props = {
  id: string
};

export default function withMiniApp(Com: React.ComponentType<*>) {
  return class ComponentWithMiniApp extends React.Component<Props> {
    app: MiniApp;
    static childContextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      request: PropTypes.func,
      deploy: PropTypes.func,
      reset: PropTypes.func
    };

    getChildContext() {
      return {
        fetch: this.app.fetch,
        subscribe: this.app.subscribe,
        request: this.app.request,
        deploy: this.deploy,
        reset: this.app.reset
      };
    }

    static contextTypes = {
      request: PropTypes.func,
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      deploy: PropTypes.func,
      componentId: PropTypes.string
    }

    constructor(props: Props, context: {request: Function, fetch: Function, subscribe: Function}) {
      super(props);
      this.app = new MiniApp({
        request: context.request,
        fetch: context.fetch,
        subscribe: context.subscribe
      });
    }

    componentWillMount() {
      this.fetchData();
    }

    componentWillReceiveProps(nextProps: Props) {
      if (nextProps.id !== this.props.id) {
        this.fetchData();
      }
    }

    fetchData = () => {
      const {query, componentId} = this.context;
      const {id} = this.props;
      this.app.fetch(id.split('/')[0], componentId, query);
    }

    deploy = (key?: string, id?: string): Promise<*> => {
      return this.app.deploy(key, id).then(() => {
        return this.context.deploy(key, id);
      });
    }

    render() {
      const {id} = this.props;
      return <Com {...this.props} id={id} />;
    }
  };
}