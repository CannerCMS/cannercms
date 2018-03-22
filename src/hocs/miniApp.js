// @flow

import * as React from 'react';
import {MiniApp} from '../app';
import type {Map} from 'immutable';

type Props = {
  id: string,
  value: Map<string, *>,
  renderChildren: (childrenProps: Object, deployButtonProps: Object, cancelButtonProps: Object) => React.Node,
  request: RequestDef,
  fetch: FetchDef,
  subscribe: SubscribeDef,
  componentId: string,
  deploy: DeployDef,
  query: QueryDef
};

export default function createWithMiniApp(Com: React.ComponentType<*>) {
  return withMiniApp(Com, MiniApp);
}

export function withMiniApp(Com: React.ComponentType<*>, MiniApp: MiniApp) {
  return class ComponentWithMiniApp extends React.Component<Props> {
    app: MiniApp;

    getProps() {
      return {
        fetch: this.app.fetch,
        subscribe: this.app.subscribe,
        request: this.app.request,
        deploy: this.deploy,
        reset: this.app.reset
      };
    }

    constructor(props: Props) {
      super(props);
      const {request, fetch, subscribe} = props;
      this.app = new MiniApp({
        request,
        fetch,
        subscribe
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
      const {query, componentId, id} = this.props;
      this.app.fetch(id.split('/')[0], componentId, query);
    }

    deploy = (key?: string, id?: string, callback?: Function): Promise<*> => {
      const {deploy} = this.props;
      return this.app.deploy(key, id).then(() => {
        return deploy(key, id).then(callback);
      });
    }

    reset = (key?: string, id?: string, callback?: Function): Promise<*> => {
      const {query} = this.props;
      return this.app.reset(key, id, query).then(callback)
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
      return <Com {...this.props} {...this.getProps()} renderChildren={newRenderChildren}/>;
    }
  };
}