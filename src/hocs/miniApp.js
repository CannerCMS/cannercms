// @flow

import * as React from 'react';
import {MiniApp} from '../app';
import type {Map} from 'immutable';
import RefId from 'canner-ref-id';
import {UNIQUE_ID} from '../app/config';

type Props = {
  refId: RefId,
  value: Map<string, any>,
  rootValue: any,
  renderConfirmButton: (deployButtonProps: Object) => React.Node,
  renderCancelButton: (cancelButtonProps: Object) => React.Node,
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

    deploy = (refId?: RefId, callback?: Function): Promise<*> => {
      const {deploy, rootValue} = this.props;
      let entryKey, recordId;
      if (refId) {
        entryKey = refId.getPathArr()[0];
        const recordIndex = refId.getPathArr()[1];
        recordId = rootValue && rootValue.getIn([recordIndex, UNIQUE_ID]);
      }
      return this.app.deploy(entryKey, recordId).then(() => {
        return deploy(refId).then(callback);
      });
    }

    reset = (refId?: RefId, callback?: Function): Promise<*> => {
      const {query, rootValue} = this.props;
      let entryKey, recordId;
      if (refId) {
        entryKey = refId.getPathArr()[0];
        const recordIndex = refId.getPathArr()[1];
        recordId = rootValue && rootValue.getIn([recordIndex, UNIQUE_ID]);
      }
      return this.app.reset(entryKey, recordId, query).then(callback)
    }

    render() {
      const {renderConfirmButton, renderCancelButton} = this.props;
      const newRenderConfirmButton = (deployProps = {}) => {
        deployProps.onClick = this.deploy;
        return renderConfirmButton(deployProps);
      };
      const newRenderCancelButton = (cancelProps = {}) => {
        cancelProps.onClick = this.reset;
        return renderCancelButton(cancelProps);
      };
      return <Com {...this.props} {...this.getProps()}
        renderConfirmButton={newRenderConfirmButton}
        renderCancelButton={newRenderCancelButton}
      />;
    }
  };
}