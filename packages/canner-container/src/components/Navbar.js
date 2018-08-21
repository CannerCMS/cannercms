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
  float: left;
`;

const HeaderMenu = styled.div`
  float: right;
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
      <Header className="header" style={{padding: "0 20px"}}>
          {
            typeof logo === 'string' ?
              <LogoContainer>
                <img src={logo} width={150}/>
              </LogoContainer> :
              (logo || null)
          }
        <HeaderMenu>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
            selectedKeys={[]}
            onClick={this.headerMenuOnClick}
          >
            { renderMenu() }
            {
              showSaveButton && (
                hasChanged ?
                <Menu.Item key="deploy">
                {
                  deploying ?
                    spinIcon :
                    <Badge dot>
                      <MenuText>
                        Save
                      </MenuText>
                    </Badge>
                }
                </Menu.Item> :
                <Menu.Item key="saved">
                  Saved
                </Menu.Item>
              )
            }
          </Menu>
        </HeaderMenu>
      </Header>
    );
  }
}
