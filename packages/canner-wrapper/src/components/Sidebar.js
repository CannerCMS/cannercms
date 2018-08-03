// @flow

import React from 'react'
import {Layout, Menu, Modal} from 'antd';
import type {SidebarProps, MenuParams} from './types';
const confirm = Modal.confirm;

export default class Sidebar extends React.Component<SidebarProps> {
  siderMenuOnClick = (menuItem: {key: string, params: MenuParams}) => {
    const {goTo, dataChanged, reset, routes} = this.props;
    const {key, params} = menuItem;

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
              goTo(key, {pathname: key, params});
            });
        },
        onCancel: () => {
        },
      });
    } else {
      goTo(key, {pathname: key, params});
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
    <Menu.Item key={item.pathname} params={item.params}>
      {item.title}
    </Menu.Item>
  )
}

function renderSubMenu(item: Object) {
  return (
    <Menu.SubMenu key={item.pathname} title={item.title}>
      {
        item.items.map(i => renderMenuItem(i))
      }
    </Menu.SubMenu>
  )
}