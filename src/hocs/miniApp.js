// @flow

import * as React from 'react';
import {MiniApp} from '../app';
import type {Map} from 'immutable';
import RefId from 'canner-ref-id';

type Props = {
  refId: RefId,
  value: Map<string, any>,
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
      if (nextProps.refId.toString() !== this.props.refId.toString()) {
        this.fetchData();
      }
    }

    fetchData = () => {
      const {query, componentId, refId} = this.props;
      this.app.fetch(refId.getPathArr()[0], componentId, query);
    }

    deploy = (key?: string, refId?: RefId, callback?: Function): Promise<*> => {
      const {deploy} = this.props;
      const idString = refId && refId.toString();
      return this.app.deploy(key, idString).then(() => {
        return deploy(key, idString).then(callback);
      });
    }

    reset = (key?: string, refId?: RefId, callback?: Function): Promise<*> => {
      const {query} = this.props;
      return this.app.reset(key, refId && refId.toString(), query).then(callback)
    }

    render() {
      const {renderChildren, refId, value} = this.props;
      const key = refId.getPathArr()[0];
      const recordId = value && value.get('_id');
      if (typeof recordId !== 'string') {
        throw new Error(`recordId is not a string, path: ${refId.toString()}`)
      }
      const newRenderChildren = (childrenProps = {}, deployProps = {}, cancelProps = {}) => {
        deployProps.key = deployProps.key || key;
        deployProps.refId = deployProps.refId || new RefId(recordId);
        deployProps.onClick = this.deploy;
        cancelProps.key = cancelProps.key || key;
        cancelProps.refId = cancelProps.refId || new RefId(recordId);
        cancelProps.onClick = this.reset;
        return renderChildren(childrenProps, deployProps, cancelProps);
      };
      return <Com {...this.props} {...this.getProps()} renderChildren={newRenderChildren}/>;
    }
  };
}