// @flow

import React from 'react'
import {Layout, Menu} from 'antd';
import type {SidebarProps} from './types';

export default class Sidebar extends React.Component<SidebarProps> {
  render() {
    const {sidebar, goTo, schema} = this.props;
    if (!sidebar) {
      return null;
    }
    return (
      <Layout.Sider>
        <Menu
          theme="dark"
          mode="inline"
        >
          {
            sidebar.length > 0 && sidebar.map(item => {
              if (item.to) {
                return renderMenuItem(item, goTo);
              }
              return renderSubMenu(item, goTo);
            })
          }
          {
            sidebar.length === 0 && Object.keys(schema).map(key => {
              const title = schema[key].title;
              return renderMenuItem({title, key, to: key}, goTo);
            })
          }
        </Menu>
      </Layout.Sider>
    );
  }
}

function renderMenuItem(item, goTo) {
  return (
    <Menu.Item key={item.title}>
      <a href="javascript:;" onClick={() => goTo(item.to)}>
        {item.title}
      </a>
    </Menu.Item>
  )
}

function renderSubMenu(item, goTo) {
  return (
    <Menu.SubMenu key={item.title} title={item.title}>
      {
        item.items.map(i => renderMenuItem(i, goTo))
      }
    </Menu.SubMenu>
  )
}