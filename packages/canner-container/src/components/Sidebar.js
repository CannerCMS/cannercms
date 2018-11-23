// @flow

import React from 'react'
import {Layout, Menu, Modal, Icon} from 'antd';
import type {SidebarProps, MenuParams} from './types';
import Error from './Error';
const confirm = Modal.confirm;

type State = {
  hasError: boolean
}

export default class Sidebar extends React.Component<SidebarProps, State> {
  state = {hasError: false}

  siderMenuOnClick = (menuItem: {key: string, params: MenuParams}) => {
    const {goTo, dataChanged, reset, routes, schema} = this.props;
    const {key, params} = menuItem;
    if (Object.keys(schema).indexOf(removeFirstSlash(key).split('/')[0]) === -1) {
      // not include in schema
      return;
    }
    if (dataChanged && Object.keys(dataChanged).length > 0 && key !== routes[0]) {
      confirm({
        title: 'Do you want to reset all changes?',
        content: <div>Leaving without deployment will reset all changes.</div>,
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          return new Promise(resolve => {
            setTimeout(resolve, 1000);
          }).then(reset)
            .then(() => {
              goTo({pathname: key, ...params});
            });
        },
        onCancel: () => {
        },
      });
    } else {
      goTo({pathname: key, ...params});
    }
  }

  componentDidCatch(error: Error, info: Object) {
    // Display fallback UI
    this.setState({ hasError: true });
    // eslint-disable-next-line
    console.log(error, info);
  }

  render() {
    const {menuConfig, routes, theme = 'dark', mode = 'inline'} = this.props;
    const {hasError} = this.state;

    // if user's customize Menu is has error, display error messages
    if (hasError) {
      return <Error />;
    }

    if (!menuConfig) {
      return null;
    }
    return (
      <Layout.Sider breakpoint="sm" collapsedWidth={0} style={{zIndex: 1}} theme={theme}>
        <Menu
          onClick={this.siderMenuOnClick}
          selectedKeys={[`/${routes[0]}`]}
          mode={mode}
          theme={theme}
        >
          {
            // $FlowIgnore
            menuConfig.length > 0 && menuConfig.map(item => {
              if (item.pathname) {
                return renderMenuItem(item);
              }
              return renderSubMenu(item);
            })
          }
        </Menu>
      </Layout.Sider>
    );
  }
}

function renderMenuItem(item: Object) {
  return (
    <Menu.Item key={item.pathname} params={item.params} onClick={item.onClick}>
      {renderIcon(item.icon)}
      {item.title || null}
    </Menu.Item>
  )
}

function renderSubMenu(item: Object) {
  return (
    <Menu.SubMenu key={`submenu-${item.pathname}`} title={item.title}>
      {renderIcon(item.icon)}
      {
        item.items.map(i => renderMenuItem(i))
      }
    </Menu.SubMenu>
  )
}

function renderIcon(icon: any) {
  if (icon) {
    return typeof icon === 'string' ?
      <Icon type={icon} />:
      icon;
  }
  return null;
}

function removeFirstSlash(key) {
  if (key[0] === '/') {
    return key.substr(1);
  }
  return key;
}