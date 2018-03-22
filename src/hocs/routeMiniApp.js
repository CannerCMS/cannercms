// @flow
import * as React from 'react';
import {List, fromJS} from 'immutable';
import {isEqual} from 'lodash';
import {Button} from 'antd';
import {MiniApp, generateAction} from '../app';

type Props = {
  type: string,
  routes: Array<string>,
  id: string,
  ui: string,
  params: {
    op: string,
    payload?: string,
    backUrl: string
  },
  createEmptyData: Function,
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

    getProps() {
      const {app} = this.state;
      return {
        fetch: app ? app.fetch : this.props.fetch,
        subscribe: app ? app.subscribe : this.props.subscribe,
        request: this.request,
        deploy: this.deploy,
        reset: this.reset
      };
    }

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
      const {createEmptyData, id, items, params} = props;
      const {app} = this.state;
      if (app) {
        const {payload} = params;
        const data = createEmptyData(items).mergeDeep(fromJS(JSON.parse(payload || "{}")));
        app.request(generateAction(id, 'create', data, new List()))
          .then(() => {
            this.setState({
              changed: true,
              canBeRendered: true
            });
          });
      }
    }

    reset = (key?: string, recordId?: string, callback?: Function): Promise<*> => {
      const {app} = this.state;
      const {id} = this.props;
      key = key || id.split('/')[0];
      if (app) {
        return app.reset(key, recordId) // reset the store and cache in miniapp
          // $FlowFixMe
          .then(() => this.queryCom && this.queryCom.queryData()) // ask component to fetch new data
          .then(callback);
      }
      return Promise.resolve();
    }

    deploy = (key?: string, recordId?: string, callback?: Function = () => {}): Promise<*> => {
      const {deploy} = this.props;
      const {app} = this.state;
      if (app) {
        return app.deploy(key, recordId).then(() => {
          return deploy(key, recordId)
            .then(callback)
            // reset should be placed after callback,
            // or component will display the new-fetched data
            .then(() => this.reset(key, recordId));
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
      const {canBeRendered, routesEndAtMe, isCreateOp, changed} = this.state;
      const {ui, routes, params, renderChildren} = this.props;
      const buttonControlledByArray = (ui === 'popup' || ui === 'breadcrumb') && routesEndAtMe && routes.length === 1 && !isCreateOp;
      const buttonContainer = {
        textAlign: 'right',
        marginTop: 60
      };
      const renderDepolyButton = genDeployButton(this.deploy);
      const renderCancelButton = genCancelButton(this.reset);
      if (canBeRendered) {
        // $FlowFixMe
        return <div>
          {/* $FlowFixMe */}
          <Com {...this.props}
            {...this.getProps()}
            ref={(queryCom: React$Ref<typeof Com>) => {
              this.queryCom = queryCom;
            }}
            renderButton={renderDepolyButton}
            renderChildren={(childrenProps, deployButtonProps, cancelButtonProps) => <React.Fragment>
              {renderChildren(childrenProps)}
              {
                routesEndAtMe && !buttonControlledByArray ?
                  null :
                  <div style={buttonContainer}>
                    {renderDepolyButton(deployButtonProps)}
                    {renderCancelButton(cancelButtonProps)}
                  </div>
              }
            </React.Fragment>}
          />
          {
            routesEndAtMe && !buttonControlledByArray ?
              // $FlowFixMe
              <div style={buttonContainer}>
                {renderDepolyButton({
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

function genDeployButton(deploy) {
  return function DeployButton({
    disabled = false,
    style = {},
    key,
    id,
    onClick = deploy,
    callback = () => {},
    // $FlowFixMe
    text = '確定',
    hidden = false
  }: {
    disabled?: boolean,
    style?: Object,
    key?: string,
    id?: string,
    onClick?: (key?: string, id?: string, callback?: Function) => Promise<*>,
    callback?: Function,
    text?: React.Node | string,
    hidden?: boolean
  } = {}) {
    if (hidden)
      return null;
    return <Button disabled={disabled} style={style} type="primary" onClick={() => onClick(key, id, callback)}>
      {text}
    </Button>;
  };
}

function genCancelButton(reset) {
  return function CancelButton({
    disabled = false,
    style = {},
    key,
    id,
    onClick = reset,
    callback = () => {},
    text = '取消',
    hidden = false
  }: {
    disabled?: boolean,
    style?: Object,
    key?: string,
    id?: string,
    onClick?: (key?: string, id?: string, callback?: Function) => Promise<*>,
    callback?: Function,
    // $FlowFixMe
    text?: React.Node,
    hidden?: boolean
  } = {}) {
    console.log(disabled);
    if (hidden)
      return null;
    return <Button disabled={disabled} style={{marginLeft: 16, ...style}} onClick={() => onClick(key, id, callback)}>
      {text}
    </Button>;
  };
}
