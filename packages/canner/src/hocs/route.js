// @flow
import * as React from 'react';
import {Button, Icon, Spin, Modal} from 'antd';
import styled from 'styled-components';
import {injectIntl} from 'react-intl';
import type {HOCProps} from './types';
import type Intl from 'react-intl';

const confirm = Modal.confirm;

export const RENDER_CHILDREN = 0;
export const RENDER_COMPONENT = 1;
export const RENDER_NULL = 2;

const ButtonWrapper = styled.div`
  text-align: right;
`
type State = {
  loading: boolean,
  loadingTip: string
}

type Props = HOCProps & {
  intl: Intl
}

@injectIntl
export default function withRoute(Com: React.ComponentType<*>) {
  return class ComWithRoute extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      const {intl} = props;
      this.state = {
        loading: false,
        loadingTip: intl.formatMessage({id: 'hocs.route.loadingTip'})
      }
    }
  
    deploy = () => {
      const {refId, deploy, intl} = this.props;
      this.setState({
        loading: true,
        loadingTip: intl.formatMessage({id: 'hocs.route.deployingTip'}),
      });
      deploy(refId.getPathArr()[0])
        .then(this.success)
        .catch(this.fail);
    }

    reset = () => {
      const {refId, reset, intl} = this.props;
      this.setState({
        loading: true,
        loadingTip: intl.formatMessage({id: 'hocs.route.resetingTip'}),
      });
      reset(refId.getPathArr()[0])
        .then(this.success)
        .catch(this.fail);
    }

    success = () => {
      const {goTo, routes} = this.props;
      setTimeout(() => {
        this.setState({
          loading: false
        }, () => {
          goTo({pathname: routes[0]});
        });
      }, 400);
    }

    fail = () => {
      this.setState({
        loading: false
      });
    }

    discard = () => {
      const {goTo, routes, routerParams, reset, refId, dataChanged, intl} = this.props;

      const resetCondFn = () => {
        if (routerParams.operator === 'create') {
          reset(refId.getPathArr()[0]).then(() => goTo({pathname: routes.join('/')}));
        } else {
          reset(refId.getPathArr()[0]).then(() => goTo({pathname: routes.slice(0, -1).join('/')}));
        }
      }
      if (dataChanged && Object.keys(dataChanged).length > 0) {
        confirm({
          title: intl.formatMessage({id: 'hocs.route.confirm.title'}),
          content: intl.formatMessage({id: 'hocs.route.confirm.content'}),
          okText: intl.formatMessage({id: 'hocs.route.confirm.okText'}),
          cancelText: intl.formatMessage({id: 'hocs.route.confirm.cancelText'}),
          onOk: () => {
            return new Promise(resolve => {
              setTimeout(resolve, 1000);
            }).then()
              .then(() => {
                resetCondFn();
              });
          },
          onCancel: () => {
          },
        });
      } else {
        resetCondFn();
      }
    }

    render() {
      const {loading, loadingTip} = this.state;
      let {routes, pattern,  path, intl, routerParams, refId, renderChildren, hideButtons, uiParams} = this.props;
      const renderType = getRenderType({
        pattern,
        routes,
        path,
        routerParams
      });
      const pathArrLength = refId.getPathArr().length;
      const routesLength = routes.length;
      const {operator} = routerParams;
      let renderKeys = uiParams && uiParams.updateKeys; // render all
      if (operator === 'create') {
        renderKeys = uiParams && uiParams.createKeys;
      }
      return <Spin tip={loadingTip} spinning={loading}>
        {
          // quick fix for route array's children
          // need to find a stable way to control route
          (renderType === RENDER_CHILDREN && pattern === 'array' && (routesLength === pathArrLength || (routesLength + 1 === pathArrLength && operator === 'create'))) &&
            <Button onClick={this.discard} style={{marginBottom: 16}}>
              <Icon type="arrow-left" /> {intl.formatMessage({id: 'hocs.route.backText'})}
            </Button>
        }
        {
          renderType === RENDER_CHILDREN && renderChildren(node => {
            return {
              hidden: renderKeys && renderKeys.indexOf(node.keyName) === -1,
              refId
            };
          })
        }
        {
          // quick fix for route array's children
          // need to find a stable way to control route
          (renderType === RENDER_CHILDREN  && pattern === 'array' && !hideButtons && (routesLength === pathArrLength || (routesLength + 1 === pathArrLength && operator === 'create'))) &&
            <ButtonWrapper>
              <Button style={{marginRight: 16}} type="primary" onClick={this.deploy}>
                {intl.formatMessage({id: 'hocs.route.confirmText'})}
              </Button>
              <Button onClick={this.reset}>
                {intl.formatMessage({id: 'hocs.route.resetText'})}
              </Button>
            </ButtonWrapper>
        }
        {
          renderType === RENDER_COMPONENT && <Com {...this.props} />
        }
      </Spin>
    }
  }
}

export function getRenderType({
  routes,
  path,
  pattern,
  routerParams
}: {
  routes: Array<string>,
  path: string,
  pattern: string,
  routerParams: Object
}) {
  const paths = genPaths(path, pattern);
  const pathsLength = paths.length;
  const routesLength = routes.length;
  if (routes[0] !== paths[0]) {
    return RENDER_NULL;
  }
  const type = pattern.split('.').slice(-1)[0];
  const {operator} = routerParams;
  if (type === 'object') {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_COMPONENT;
    }
    if (routesLength < pathsLength) {
      return RENDER_COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_CHILDREN;
    }
    return RENDER_NULL;
  } else if (type === 'array') {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_CHILDREN;
    }
    if (routesLength < pathsLength) {
      if (routesLength === pathsLength - 1 && operator === 'create') {
        return RENDER_CHILDREN;
      }
      return RENDER_COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_COMPONENT;
    }
    return RENDER_NULL;
  } else {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_NULL;
    }
    if (routesLength < pathsLength) {
      return RENDER_COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_COMPONENT;
    }
    return RENDER_NULL;
  }
}

export function isCompleteContain(paths: Array<string>, routes: Array<string>) {
  return paths.map((key, i) => routes[i] === key || key === '__ARRAY_INDEX__')
    .reduce((result: any, curr: any) => result && curr);
}

export function genPaths(path: string, pattern: string): Array<string> {
  const patterns = pattern.split('.');
  const indexs = patterns.map((type, i) => type === 'array' ? i : -1)
    .filter(index => index !== -1);
  let paths = path.split('/')
    .map((route, i) => indexs.indexOf(i) === -1 ? route : [].concat(route, '__ARRAY_INDEX__'))
    .reduce((result: any, curr: any) => result.concat(curr), []);
  return paths;
}
