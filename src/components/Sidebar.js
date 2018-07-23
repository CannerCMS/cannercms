// @flow

import React from 'react'
import {Layout, Menu, Modal} from 'antd';
import type {SidebarProps} from './types';
const confirm = Modal.confirm;

export default class Sidebar extends React.Component<SidebarProps> {
  siderMenuOnClick = (menuItem: {key: string}) => {
    const {goTo, dataChanged, reset, routes} = this.props;
    const {key} = menuItem;

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
              goTo(key);
            });
        },
        onCancel: () => {
        },
      });
    } else {
      goTo(key);
    }
  }

  render() {
    const {sidebar, schema, routes} = this.props;
    if (!sidebar) {
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
            sidebar.length > 0 && sidebar.map(item => {
              if (item.to) {
                return renderMenuItem(item);
              }
              return renderSubMenu(item);
            })
          }
          {
            sidebar.length === 0 && Object.keys(schema).map(key => {
              const title = schema[key].title;
              return renderMenuItem({title, key, to: key});
            })
          }
        </Menu>
      </Layout.Sider>
    );
  }
}

function renderMenuItem(item) {
  return (
    <Menu.Item key={item.to}>
      {item.title}
    </Menu.Item>
  )
}

function renderSubMenu(item) {
  return (
    <Menu.SubMenu key={item.to} title={item.title}>
      {
        item.items.map(i => renderMenuItem(i))
      }
    </Menu.SubMenu>
  )
}