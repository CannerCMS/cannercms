// @flow

import React from 'react'
import {Layout, Menu, Modal, Icon} from 'antd';
import type {SidebarProps, MenuParams} from './types';
const confirm = Modal.confirm;

export default class Sidebar extends React.Component<SidebarProps> {
  siderMenuOnClick = (menuItem: {key: string, params: MenuParams}) => {
    const {goTo, dataChanged, reset, routes, schema} = this.props;
    const {key, params} = menuItem;
    if (Object.keys(schema).indexOf(key.split('/')[1]) === -1) {
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

  render() {
    const {menuConfig, routes} = this.props;
    if (!menuConfig) {
      return null;
    }
    return (
      <Layout.Sider>
        <Menu
          onClick={this.siderMenuOnClick}
          selectedKeys={[routes[0]]}
          theme="dark"
          mode="inline"
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