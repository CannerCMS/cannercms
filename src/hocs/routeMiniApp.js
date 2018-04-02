// @flow
import * as React from 'react';
import {List, fromJS} from 'immutable';
import {isEqual} from 'lodash';
import {Button} from 'antd';
import {MiniApp, generateAction} from '../app';
import type RefId from 'canner-ref-id';
import {UNIQUE_ID} from '../app/config';
import {createEmptyData} from '@canner/react-cms-helpers';

type Props = {
  type: string,
  routes: Array<string>,
  refId: RefId,
  ui: string,
  params: {
    op: string,
    payload?: string,
    backUrl: string
  },
  items: {[string]: any},
  renderChildren: Function,
  request: RequestDef,
  fetch: FetchDef,
  deploy: DeployDef,
  subscribe: SubscribeDef
};

type State = {
  canBeRendered: boolean,
  app: ?MiniApp,
  routesEndAtMe: boolean,
  isCreateOp: boolean,
  changed: boolean
};

const CREATE = 'create';
// eslint-disable-next-line
const UPDATE = 'update';

export default function routeMiniApp(Com: React.ComponentType<*>) {
  return class ComponentWithRouteMiniApp extends React.Component<Props, State> {
    app: ?MiniApp;
    routesEndAtMe: boolean;
    isCreateOp: boolean;
    queryCom: React.Ref<typeof Com>;

    constructor(props: Props) {
      super(props);
      const {app, routesEndAtMe, isCreateOp} = this.init(props);
      this.state = {
        app,
        routesEndAtMe,
        isCreateOp,
        canBeRendered: !routesEndAtMe || !isCreateOp,
        changed: false
      };
      if (routesEndAtMe && isCreateOp) {
        this.reset().then(() => this.create(props));
      }
    }

    componentWillReceiveProps(nextProps: Props) {
      if (this.props.params.op !== nextProps.params.op || !isEqual(this.props.routes, nextProps.routes)) {
        const {app, routesEndAtMe, isCreateOp} = this.init(nextProps);
        // everytime change the route, should reset the miniApp !
        if (this.state.changed) {
          this.reset();
        }
        this.setState({
          app,
          routesEndAtMe,
          isCreateOp,
          canBeRendered: !routesEndAtMe || !isCreateOp,
        }, () => {
          if (routesEndAtMe && isCreateOp) {
            this.reset().then(() => this.create(nextProps));
          }
        });
      }
    }

    request = (action: any) => {
      const {request} = this.props;
      this.didChanged();
      const {app} = this.state;
      if (app) {
        return app.request(action);
      }
      return request(action);
    }

    didChanged = () => {
      this.setState({
        changed: true
      });
    }

    init = (props: Props = this.props) => {
      // when route or params change, upgrade the state, and re-new a miniapp instance if have to
      let {routes, params, type, request, fetch, subscribe} = props;
      routes = routes || [];
      const routesEndAtMe = routes.length === 1 || (routes.length === 2 && type === 'array');
      const isCreateOp = params.op === CREATE;
      let app = null;
      if (routesEndAtMe) {
        // to cache the data of this page
        app = new MiniApp({
          request,
          fetch,
          subscribe
        });
      }
      return {
        app,
        routesEndAtMe,
        isCreateOp
      };
    }

    create = (props: Props = this.props) => {
      // this method is for route op
      const {refId, items, params} = props;
      const {app} = this.state;
      if (app) {
        const {payload} = params;
        const data = createEmptyData(items).mergeDeep(fromJS(JSON.parse(payload || "{}")));
        app.request(generateAction(refId.toString(), 'create', data, new List()))
          .then(() => {
            this.setState({
              changed: true,
              canBeRendered: true
            });
          });
      }
    }

    reset = (refId?: RefId, callback?: Function): Promise<*> => {
      const {app} = this.state;
      let entryKey, recordId;
      if (refId) {
        entryKey = refId.getPathArr()[0];
        const recordIndex = refId.getPathArr()[1];
        // $FlowFixMe: queryCom should have this method
        const rootValue = this.queryCom && this.queryCom.getRootValue();
        recordId = rootValue && rootValue.getIn([recordIndex, UNIQUE_ID]);
      }
      if (app) {
        return app.reset(entryKey, recordId) // reset the store and cache in miniapp
          // $FlowFixMe: queryCom should have this method
          .then(() => this.queryCom && this.queryCom.queryData()) // ask component to fetch new data
          .then(callback);
      }
      return Promise.resolve();
    }

    deploy = (refId?: RefId, callback?: Function = () => {}): Promise<*> => {
      const {deploy} = this.props;
      const {app} = this.state;
      let entryKey, recordId;
      if (refId) {
        entryKey = refId.getPathArr()[0];
        const recordIndex = refId.getPathArr()[1];
        // $FlowFixMe: queryCom should have this method
        const rootValue = this.queryCom && this.queryCom.getRootValue();
        recordId = rootValue && rootValue.getIn([recordIndex, UNIQUE_ID]);
      }
      if (app) {
        return app.deploy(entryKey, recordId).then(() => {
          return deploy(refId)
            .then(callback)
            // reset should be placed after callback,
            // or component will display the new-fetched data
            .then(() => this.reset(refId));
        });
      }
      return Promise.resolve()
        .then(callback);
    }

    resetButton = () => {
      this.setState({
        changed: false,
      });
    }

    render() {
      const {canBeRendered, routesEndAtMe, isCreateOp, changed, app} = this.state;
      const {ui, params, routes, renderChildren, fetch, subscribe, refId} = this.props;
      const buttonControlledByArray = (ui === 'popup' || ui === 'breadcrumb') && routesEndAtMe && routes.length === 1 && !isCreateOp;
      const buttonContainer = {
        textAlign: 'right',
        marginTop: 60
      }
      const renderConfirmButton = genDeployButton(this.deploy, refId);
      const renderCancelButton = genCancelButton(this.reset, refId);
      if (canBeRendered) {
        // $FlowFixMe
        return <div>
          {/* $FlowFixMe */}
          <Com {...this.props}
            fetch={app ? app.fetch : fetch}
            subscribe={app ? app.subscribe : subscribe}
            request={this.request}
            deploy={this.deploy}
            reset={this.reset}
            ref={(queryCom: React$Ref<typeof Com>) => {
              this.queryCom = queryCom;
            }}
            renderChildren={renderChildren}
            renderConfirmButton={renderConfirmButton}
            renderCancelButton={renderCancelButton}
          />
          {
            routesEndAtMe && !buttonControlledByArray ?
              // $FlowFixMe
              <div style={buttonContainer}>
                {renderConfirmButton({
                  disabled: !changed,
                  callback: () => {
                    location.href = params.backUrl || location.href.split('?')[0];
                  }
                })}
                {renderCancelButton({
                  disabled: !changed,
                  callback: this.resetButton,
                  hidden: isCreateOp
                })}
              </div>:
              null
          }
        </div>;
      }
      return null;
    }
  };
}

type buttonProps = {
  disabled?: boolean,
  style?: Object,
  refId?: RefId,
  onClick?: (refId?: RefId, callback?: Function) => Promise<*>,
  callback?: Function,
  text?: React.Node | string,
  hidden?: boolean
}

function genDeployButton(deploy: Function, currentRefId: RefId) {
  return function DeployButton({
    disabled = false,
    style = {},
    refId = currentRefId,
    onClick = deploy,
    callback = () => {},
    // $FlowFixMe
    text = '確定',
  }: buttonProps = {}) {
    return <Button disabled={disabled} style={style} type="primary" onClick={() => onClick(refId, callback)}>
      {text}
    </Button>;
  };
}

function genCancelButton(reset: Function, currentRefId: RefId) {
  return function CancelButton({
    disabled = false,
    style = {},
    refId = currentRefId,
    onClick = reset,
    callback = () => {},
    // $FlowFixMe
    text = '取消',
  }: buttonProps = {}) {
    return <Button disabled={disabled} style={{marginLeft: 16, ...style}} onClick={() => onClick(refId, callback)}>
      {text}
    </Button>;
  };
}
