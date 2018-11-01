// @flow

import React from 'react'
import {Layout, Menu, Badge, Icon, notification} from 'antd';
import type {NavbarProps} from './types';
import styled from 'styled-components';
const {Header} = Layout;
const MenuText = styled.span`
  color: rgba(255, 255, 255, .65);
  &:hover {
    color: #fff;
  }
`;

const LogoContainer = styled.div`
  width: 150px;
`;

const HeaderMenu = styled.div`
`;


type State = {
  deploying: boolean
};

export default class Navbar extends React.Component<NavbarProps, State> {
  state = {
    deploying: false,
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
    const {dataChanged, logo, renderMenu, showSaveButton} = this.props;
    const {deploying} = this.state;
    const hasChanged = dataChanged && Object.keys(dataChanged).length;
    const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <Header style={{padding: "0 20px", display: 'flex', justifyContent: 'space-between'}}>
          {
            typeof logo === 'string' ?
              <LogoContainer>
                <img src={logo} width={150}/>
              </LogoContainer> :
              (logo || <div></div>) // render emptry div instead of null to make space-between works
          }
        <HeaderMenu>
          { renderMenu && renderMenu() }
          <Menu
            mode="horizontal"
            style={{ lineHeight: '64px', display: 'inline-block', background: 'transparent' }}
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
                <Menu.Item key="deploy">
                  <Badge dot>
                    <MenuText>
                      Save
                    </MenuText>
                  </Badge>
                </Menu.Item> :
                <Menu.Item key="saved">
                  <MenuText>
                    Saved
                  </MenuText>
                </Menu.Item>
              )
            }
          </Menu>
        </HeaderMenu>
      </Header>
    );
  }
}
