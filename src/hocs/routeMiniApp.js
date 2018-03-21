// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
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
  renderChildren: Function
};

type State = {
  canBeRendered: boolean,
  app: ?MiniApp,
  routesEndAtMe: boolean,
  isCreateOp: boolean,
  buttonType: string,
  changed: boolean
};

type Context = {
  fetch: PropTypes.func,
  subscribe: PropTypes.func,
  request: PropTypes.func
}

const CREATE = 'create';
const UPDATE = 'update';

export default function routeMiniApp(Com: React.ComponentType<*>) {
  return class ComponentWithRouteMiniApp extends React.Component<Props, State> {
    app: ?MiniApp;
    routesEndAtMe: boolean;
    isCreateOp: boolean;
    queryCom: React.Ref<typeof Com>;
    static childContextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      request: PropTypes.func,
      deploy: PropTypes.func,
      reset: PropTypes.func
    };

    getChildContext() {
      const {app} = this.state;
      return {
        fetch: app ? app.fetch : this.context.fetch,
        subscribe: app ? app.subscribe : this.context.subscribe,
        request: this.request,
        deploy: this.deploy,
        reset: this.reset
      };
    }

    static contextTypes = {
      request: PropTypes.func,
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      deploy: PropTypes.func
    }

    constructor(props: Props, context: Context) {
      super(props);
      const {app, routesEndAtMe, isCreateOp} = this.init(props, context);
      this.state = {
        app,
        routesEndAtMe,
        isCreateOp,
        canBeRendered: !routesEndAtMe || !isCreateOp,
        buttonType: isCreateOp ? CREATE : UPDATE,
        changed: false
      };
      if (routesEndAtMe && isCreateOp) {
        this.reset().then(() => this.create(props));
      }
    }

    componentWillReceiveProps(nextProps: Props, nextContext: Context) {
      if (this.props.params.op !== nextProps.params.op || !isEqual(this.props.routes, nextProps.routes)) {
        const {app, routesEndAtMe, isCreateOp} = this.init(nextProps, nextContext);
        // everytime change the route, should reset the miniApp !
        if (this.state.changed) {
          this.reset();
        }
        this.setState({
          app,
          routesEndAtMe,
          isCreateOp,
          canBeRendered: !routesEndAtMe || !isCreateOp,
          buttonType: isCreateOp ? CREATE : UPDATE
        }, () => {
          if (routesEndAtMe && isCreateOp) {
            this.reset().then(() => this.create(nextProps));
          }
        });
      }
    }

    request = (action: any) => {
      this.didChanged(action.type);
      const {app} = this.state;
      if (app) {
        return app.request(action);
      }
      return this.context.request(action);
    }

    didChanged = (updateType: string) => {
      if (updateType === 'CREATE_ARRAY_ITEM') {
        this.setState({
          changed: true,
          buttonType: CREATE
        });
      } else {
        this.setState(preState => ({
          changed: true,
          buttonType: preState.buttonType === CREATE ? CREATE : UPDATE
        }));
      }
    }

    init = (props: Props = this.props, context: Context = this.context) => {
      // when route or params change, upgrade the state, and re-new a miniapp instance if have to
      let {routes, params, type} = props;
      routes = routes || [];
      const routesEndAtMe = routes.length === 1 || (routes.length === 2 && type === 'array');
      const isCreateOp = params.op === CREATE;
      let app = null;
      if (routesEndAtMe) {
        // to cache the data of this page
        app = new MiniApp({
          request: context.request,
          fetch: context.fetch,
          subscribe: context.subscribe
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
              buttonType: CREATE,
              canBeRendered: true
            });
          });
      }
    }

    reset = (key?: string, id?: string, callback?: Function): Promise<*> => {
      key = key || this.props.id.split('/')[0];
      if (this.state.app) {
        return this.state.app.reset(key, id) // reset the store and cache in miniapp
          // $FlowFixMe
          .then(() => this.queryCom && this.queryCom.queryData()) // ask component to fetch new data
          .then(callback);
      }
      return Promise.resolve();
    }

    deploy = (key?: string, id?: string, callback?: Function = () => {}): Promise<*> => {
      if (this.state.app) {
        return this.state.app.deploy(key, id).then(() => {
          return this.context.deploy(key, id)
            .then(callback)
            // reset should be placed after callback,
            // or component will display the new-fetched data
            .then(() => this.reset(key, id));
        });
      }
      return Promise.resolve()
        .then(callback);
    }

    resetButton = () => {
      this.setState({
        changed: false,
        buttonType: UPDATE
      });
    }

    render() {
      const {canBeRendered, routesEndAtMe, isCreateOp, buttonType, changed} = this.state;
      const {ui, routes, params, renderChildren} = this.props;
      const buttonControlledByArray = (ui === 'popup' || ui === 'tab' || ui === 'panel' || ui === 'breadcrumb') && routesEndAtMe && routes.length === 1 && !isCreateOp;
      const buttonStyle = {
        left: '100%',
        transform: 'translateX(-100%)'
      };
      const renderDepolyButton = genDeployButton(this.deploy);
      const renderCancelButton = genCancelButton(this.reset);
      if (canBeRendered) {
        // $FlowFixMe
        return <div>
          {/* $FlowFixMe */}
          <Com {...this.props} ref={(queryCom: React$Ref<typeof Com>) => {
              this.queryCom = queryCom;
            }} deploy={this.deploy} renderButton={renderDepolyButton}
            renderChildren={(childrenProps, deployButtonProps, cancelButtonProps) => <React.Fragment>
              {renderChildren(childrenProps)}
              {renderCancelButton(cancelButtonProps)}
              {renderDepolyButton(deployButtonProps)}
            </React.Fragment>}
          />
          {
            routesEndAtMe && !buttonControlledByArray ?
              // $FlowFixMe
              <React.Fragment>
                {renderDepolyButton({
                  disabled: !changed,
                  style: buttonStyle,
                  buttonType,
                  callback: () => {
                    location.href = params.backUrl || location.href.split('?')[0];
                  }
                })}
                {renderCancelButton({
                  disabled: !changed,
                  style: buttonStyle,
                  buttonType,
                  callback: this.resetButton
                })}
              </React.Fragment>:
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
    buttonType = UPDATE,
    key,
    id,
    onClick = deploy,
    callback = () => {},
    // $FlowFixMe
    updateText = '新增',
    // $FlowFixMe
    createText = '更新',
    hidden = false
  }: {
    disabled?: boolean,
    style?: Object,
    buttonType?: typeof UPDATE | typeof CREATE,
    key?: string,
    id?: string,
    onClick?: (key?: string, id?: string, callback?: Function) => Promise<*>,
    callback?: Function,
    updateText?: React.Node | string,
    createText?: React.Node,
    hidden?: boolean
  } = {}) {
    if (hidden)
      return null;
    return <Button disabled={disabled} style={style} type="primary" onClick={() => onClick(key, id, callback)}>
      {buttonType === CREATE ? createText : updateText}
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
    if (hidden)
      return null;
    return <Button disabled={disabled} style={style} onClick={() => onClick(key, id, callback)}>
      {text}
    </Button>;
  };
}
