// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {MiniApp} from '../app';
import type {Map} from 'immutable';

type Props = {
  id: string,
  value: Map<string, *>,
  renderChildren: (childrenProps: Object, deployButtonProps: Object, cancelButtonProps: Object) => React.Node
};

export default function createWithMiniApp(Com: React.ComponentType<*>) {
  return withMiniApp(Com, MiniApp);
}

export function withMiniApp(Com: React.ComponentType<*>, MiniApp: MiniApp) {
  return class ComponentWithMiniApp extends React.Component<Props> {
    app: MiniApp;
    static childContextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      request: PropTypes.func,
      deploy: PropTypes.func,
      reset: PropTypes.func,
      query: PropTypes.shape({
        filter: PropTypes.any,
        sort: PropTypes.any,
        pagination: PropTypes.any
      }),
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

    deploy = (key?: string, id?: string, callback?: Function): Promise<*> => {
      return this.app.deploy(key, id).then(() => {
        return this.context.deploy(key, id).then(callback);
      });
    }

    reset = (key?: string, id?: string, callback?: Function): Promise<*> => {
      return this.app.reset(key, id, this.context.query).then(callback)
    }

    render() {
      const {renderChildren, id, value} = this.props;
      const key = id.split('/')[0];
      const recordId = value && value.get('_id');
      const newRenderChildren = (childrenProps = {}, deployProps = {}, cancelProps = {}) => {
        deployProps.key = deployProps.key || key;
        deployProps.id = deployProps.id || recordId;
        deployProps.onClick = this.deploy;
        cancelProps.key = cancelProps.key || key;
        cancelProps.id = cancelProps.id || recordId;
        cancelProps.onClick = this.reset;
        return renderChildren(childrenProps, deployProps, cancelProps);
      };
      return <Com {...this.props} renderChildren={newRenderChildren}/>;
    }
  };
}