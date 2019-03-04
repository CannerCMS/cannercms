import * as React from 'react';
import { Menu, Icon, Avatar, Select } from 'antd';
import styled from 'styled-components';
import {FormattedMessage} from 'react-intl';

const SubMenu = Menu.SubMenu;
const {Option} = Select;

const ItemContent = styled.div`
  a {
    color: #fff !important;
  }
  .ant-badge {
    color: #fff;
  }
`;

export interface Props {
  history?: any;
  location?: any;
  theme?: 'dark' | 'light';
  style?: Object;
  user: Record<string, any>;
}

export default class HeaderContainer extends React.Component<Props, {}> {
  private headerMenuOnClick = (menuItem: { key: string }) => {
    const {history} = this.props;

    if (menuItem.key === 'logout') {
      location.href = '/auth/logout';
    }
  };

  onChangeSandbox = (value: string) => {
    const {history, location} = this.props;
    history.push(`${location.pathname}?env=${value}`);
  }

  render() {
    const { user, theme = 'dark', style = {} } = this.props;
    if (!user || !user.username) {
      return null;
    }
    return (
      <Menu
        theme={theme}
        mode="horizontal"
        style={{ lineHeight: '60px', display: 'inline-block', ...style }}
        onClick={this.headerMenuOnClick}
        selectedKeys={[]}
      >
        <SubMenu
          title={
            <span>
              {
                user.thumb && (
                  <Avatar src={user.thumb}  style={{ marginRight: '10px' }} />
                )
              }
              <FormattedMessage
                id="cmspage.header.hi"
                defaultMessage="Hi, "
              />
               {user.username}
            </span>
          }
        >
          <Menu.Item key="logout">
            <ItemContent>
              <Icon type="poweroff" />
              <FormattedMessage
                id="cmspage.header.logout"
                defaultMessage="Logout"
              />
            </ItemContent>
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}