import React from 'react'
import {Layout, Menu} from 'antd';


export default class Sidebar extends React.Component {
  render() {
    const {sidebar, goTo} = this.props;
    return (
      <Layout.Sider>
        <Menu>
          {
            sidebar.map(item => {
              if (item.to) {
                return renderMenuItem(item, goTo);
              }
              return renderSubMenu(item, goTo);
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
      <a href="javascript;" onClick={() => goTo(item.to)}>
        {item.title}
      </a>
    </Menu.Item>
  )
}

function renderSubMenu(item, goTo) {
  return (
    <Menu.SubMenu key={item.title}>
      {
        item.items.map(i => renderMenuItem(i, goTo))
      }
    </Menu.SubMenu>
  )
}