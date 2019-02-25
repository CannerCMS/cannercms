// @flow

import React from 'react'
import {Button, Layout, Menu, Badge, Icon, notification, Drawer} from 'antd';
import type {NavbarProps} from './types';
import styled from 'styled-components';
const {Header} = Layout;
const MenuText = styled.span`
  color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, .65)' : 'rgba(0, 0, 0, .85)'}
  &:hover {
    color: ${props => props.theme === 'dark' ? '#fff' : '#333'}
  }
`;

export const LogoContainer = styled.div`
  background: ${props => `url(${props.url}) center no-repeat`};
  background-size: contain;
  width: ${props => ensureString(props.width) || '150px'};
  height: ${props => ensureString(props.height) || '100%'};
`;

const HeaderMenu = styled.div`
  @media (max-width: 576px) {
    display: none;
  }
`;

const DrawerMenu = styled.div`
  @media (min-width: 576px) {
    display: none;
  }
`;


type State = {
  deploying: boolean,
  drawerVisible: boolean
};

export default class Navbar extends React.Component<NavbarProps, State> {
  state = {
    deploying: false,
    drawerVisible: false
  }

  triggerDrawer = () => {
    this.setState({
      drawerVisible: !this.state.drawerVisible
    });
  }

  deploy = () => {
    const {deploy, dataChanged} = this.props;
    if (deploy) {
      this.setState({
        deploying: true
      });
      const key = Object.keys(dataChanged)[0];
      return deploy(key)
        .then(() => {
          setTimeout(() => {
            this.setState({
              deploying: false
            });
            notification.success({
              message: 'Save successfully!',
              description: 'Your changes have been saved.',
              placement: 'bottomRight'
            });
          }, 1000)
        })
        .catch(() => {
          this.setState({
            deploying: false
          });
        });
    }
  }

  headerMenuOnClick = (menuItem: {key: string}) => {
    if (menuItem.key === 'deploy') {
      this.deploy();
    }
  }

  render() {
    const {dataChanged, logo, renderMenu, showSaveButton, theme = "dark", style = {}, menuStyle = {}, drawerStyle = {}} = this.props;
    const {drawerVisible} = this.state;
    const {deploying} = this.state;
    const hasChanged = dataChanged && Object.keys(dataChanged).length;
    const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const Logo = getLogo(logo, theme);
    const renderNav = ({
      mode,
      theme
    }) => (
      <React.Fragment>
        {
          mode === 'inline' && (
            <Menu
              mode={mode}
              theme={theme}
              selectedKeys={[]}
              onClick={this.headerMenuOnClick}
              style={{paddingBottom: 16, ...menuStyle}}
            >
              <Menu.Item key="__logo">
              {Logo}
              </Menu.Item>
            </Menu>
          )
        }
        { renderMenu && renderMenu({mode, theme}) }
        <Menu
          mode={mode}
          theme={theme}
          style={{ lineHeight: '64px', display: mode === 'horizontal' ? 'inline-block' : 'block', ...menuStyle }}
          selectedKeys={[]}
          onClick={this.headerMenuOnClick}
        >
          {
            showSaveButton && deploying && (
              <Menu.Item key="loading">
                {spinIcon}
              </Menu.Item>
            )
          }
          {
            showSaveButton && !deploying && (
              hasChanged ?
              <Menu.Item key="deploy" data-testid="navbar-deploy-button" >
                <Badge dot>
                  <MenuText theme={theme}>
                    Save
                  </MenuText>
                </Badge>
              </Menu.Item> :
              <Menu.Item key="saved">
                <MenuText theme={theme}>
                  Saved
                </MenuText>
              </Menu.Item>
            )
          }
        </Menu>
      </React.Fragment>
    );
    return (
      <Header style={{padding: "0 20px", display: 'flex', justifyContent: 'space-between', ...style}}>
        {Logo}
        <HeaderMenu>
          {renderNav({mode: 'horizontal', theme})}
        </HeaderMenu>
        <DrawerMenu>
          <Button icon="setting" shape="circle" ghost onClick={this.triggerDrawer} style={{border: 0}}/>
          <Drawer
            height="auto"
            style={{padding: 0, height: 'auto', ...drawerStyle}}
            placement={"top"}
            closable={false}
            visible={drawerVisible}
            onClose={this.triggerDrawer}
          >
          {renderNav({mode: 'inline', theme})}
          </Drawer>
        </DrawerMenu>
      </Header>
    );
  }
}

function getLogo(logo: any, theme: 'dark' | 'light') {
  if (typeof logo === 'string') {
    return (
      <LogoContainer url={logo} theme={theme} />
    );
  }
  if (typeof logo === 'function') {
    return getLogo(logo(theme), theme);
  }
  if (logo && typeof logo === 'object' && logo.src) {
    return (
      <a href={logo.href}>
        <LogoContainer url={logo.src} width={logo.width} height={logo.height} theme={theme} />
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