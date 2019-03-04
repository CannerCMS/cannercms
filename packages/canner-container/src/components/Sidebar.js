// @flow

import React from 'react'
import {Layout, Menu, Modal, Icon} from 'antd';
import styled from 'styled-components';
import type {SidebarProps, MenuParams} from './types';
import Error from './Error';
const confirm = Modal.confirm;

type State = {
  hasError: boolean
}

export const LogoContainer = styled.div`
  background: ${props => `url(${props.url}) center no-repeat`};
  background-size: contain;
  margin: ${props => props.margin || `auto`};
  width: ${props => ensureString(props.width) || '150px'};
  height: ${props => ensureString(props.height) || '64px'};
`;

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
    const {menuConfig, logo, routes, theme = 'dark', mode = 'inline', style = {}, menuStyle = {}} = this.props;
    const {hasError} = this.state;

    // if user's customize Menu is has error, display error messages
    if (hasError) {
      return <Error />;
    }

    if (!menuConfig) {
      return null;
    }

    const Logo = getLogo(logo, theme);

    return (
      <Layout.Sider breakpoint="sm" width={style.width || 200} collapsedWidth={0} style={{zIndex: 1, ...style}} theme={theme}>
        {Logo}
        <Menu
          onClick={this.siderMenuOnClick}
          selectedKeys={[`${routes[0]}`]}
          mode={mode}
          theme={theme}
          style={{paddingTop: 12, ...menuStyle}}
        >
          {
            // $FlowIgnore
            menuConfig.length > 0 && menuConfig.map(item => {
              return renderMenu(item);
            })
          }
        </Menu>
      </Layout.Sider>
    );
  }
}

function renderMenu(item: Object) {
  if (item.group && item.items) {
    return renderItemGroup(item);
  }
  if (item.items) {
    return renderSubMenu(item);
  }
  return renderMenuItem(item);
}

function renderMenuItem(item: Object) {
  if (item.href) {
    item.onClick = () => location.href = item.href;
  }
  return (
    <Menu.Item key={item.pathname} params={item.params} onClick={item.onClick} data-testid={`sidebar-${item.pathname}`}>
      {renderIcon(item.icon)}
      {item.title || null}
    </Menu.Item>
  )
}

function renderItemGroup(item: Object) {
  return (
    <Menu.ItemGroup title={item.title}>
      {
        item.items.map(i => renderMenu(i))
      }
    </Menu.ItemGroup>
  )
}

function renderSubMenu(item: Object) {
  return (
    <Menu.SubMenu key={`submenu-${item.pathname}`} title={item.title} data-testid={`sidebar-${item.pathname}`}>
      {renderIcon(item.icon)}
      {
        item.items.map(i => renderMenu(i))
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


function getLogo(logo: any, theme: 'dark' | 'light') {
  if (typeof logo === 'string') {
    return (
      <LogoContainer url={logo} theme={theme} style={{}}/>
    );
  }
  if (typeof logo === 'function') {
    return getLogo(logo(theme), theme);
  }
  if (logo && typeof logo === 'object' && logo.src) {
    return (
      <a href={logo.href}
        style={
          logo.backgroundColor ? {
            backgroundColor: logo.backgroundColor,
            display: 'block'
          }: {}
        }
      >
        <LogoContainer
          url={logo.src}
          theme={theme}
          width={logo.width}
          height={logo.height}
          margin={logo.margin}
        />
      </a>
    );
  }
  // react component
  return logo || <div></div>; // render emptry div instead of null to make space-between works
}

function ensureString(length: number | string): string {
  if (typeof length === 'number') {
    return `${length}px`;
  }
  return length;
}