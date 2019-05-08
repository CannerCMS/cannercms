// @flow

import React from 'react'
// $FlowFixMe: antd.notification
import {Button, Layout, Menu, Badge, Icon, notification, Drawer} from 'antd';
import type {NavbarProps} from './types';
import styled from 'styled-components';
const {Header} = Layout;
// TODO: fix flow type

const MenuText = styled.span`
  color: ${(props: any) => props.theme === 'dark' ? 'rgba(255, 255, 255, .65)' : 'rgba(0, 0, 0, .85)'}
  &:hover {
    color: ${(props: any) => props.theme === 'dark' ? '#fff' : '#333'}
  }
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

    if (logo) {
      // eslint-disable-next-line
      console.error(`Unexpected property 'logo' in navbar config, it should be put in sidebar config!`);
    }

    const renderNav = ({
      mode,
      theme
    }) => (
      <React.Fragment>
        { renderMenu && renderMenu({mode, theme}) }
        <Menu
          mode={mode}
          theme={theme}
          style={{ lineHeight: '60px', borderBottom: 'none', display: mode === 'horizontal' ? 'inline-block' : 'block', ...menuStyle }}
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
              <Menu.Item key="saved" data-testid="navbar-saved-button">
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
      <Header style={{padding: "0 20px", textAlign: 'right', ...style}}>
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
