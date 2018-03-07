// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {List, fromJS} from 'immutable';
import {isEqual} from 'lodash';
import {Button} from 'antd';
import {MiniApp, generateAction} from 'provider';

type Props = {
  type: string,
  routes: Array<string>,
  rootValue: List<any>,
  name: string,
  id: string,
  ui: string,
  params: {
    op: string,
    payload?: string,
    backUrl: string
  },
  createEmptyData: Function,
  items: {[string]: any},
  query: {[string]: any}
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

const genDeployButton = deploy => function DeployButton({
  disabled = false,
  style = {},
  buttonType = UPDATE,
  key,
  id,
  callback
}) {
  return <Button disabled={disabled} style={style} type="primary" onClick={() => deploy(key, id, callback)}>
    {buttonType === CREATE ? '新增' : '更新'}
  </Button>;
};

export default function routeMiniApp(Com: React.ComponentType<*>) {
  return class ComponentWithRouteMiniApp extends React.Component<Props, State> {
    app: ?MiniApp;
    routesEndAtMe: boolean;
    isCreateOp: boolean;
    queryCom: ?typeof Com;
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
        this.create(props);
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
            this.create(nextProps);
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

    reset = (): Promise<*> => {
      const {id, query} = this.props;
      const key = id.split('/')[0];
      if (this.state.app) {
        return this.state.app.reset(key, query) // reset the store and cache in miniapp
          .then(() => this.queryCom.queryData()) // ask component to fetch new data
          .then(this.resetButton);
      }
      return Promise.resolve();
    }

    deploy = (key?: string, id?: string, callback?: Function = () => {}): Promise<*> => {
      if (this.state.app) {
        return this.state.app.deploy(key, id).then(() => {
          return this.context.deploy(key, id)
            .then(callback)
            .then(this.reset);
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
      const {ui, routes, params} = this.props;
      const atArrayOutSide = (ui === 'popup' || ui === 'tab' || ui === 'panel' || ui === 'breadcrumb') && routesEndAtMe && routes.length === 1 && !isCreateOp;
      const buttonStyle = {
        left: '100%',
        transform: 'translateX(-100%)'
      };
      const renderButton = genDeployButton(this.deploy);
      if (canBeRendered) {
        // $FlowFixMe
        return <div>
          {/* $FlowFixMe */}
          <Com {...this.props} ref={queryCom => {
            this.queryCom = queryCom;
          }} deploy={this.deploy} renderButton={renderButton}/>
          {
            routesEndAtMe && !atArrayOutSide ?
              // $FlowFixMe
              renderButton({
                disabled: !changed,
                style: buttonStyle,
                buttonType,
                callback: () => {
                  location.href = params.backUrl || location.href.split('?')[0];
                }
              }) :
              null
          }
        </div>;
      }
      return null;
    }
  };
}