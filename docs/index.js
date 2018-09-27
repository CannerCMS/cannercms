import * as React from 'react';
import ReactDOM from 'react-dom';
import {Menu, notification} from 'antd';
const SubMenu = Menu.SubMenu;
import Canner from 'packages/canner/src';
import Container, {transformSchemaToMenuConfig} from 'packages/canner-container/src';
import R from 'packages/router/src';
import schema from './canner.schema';
import styled from 'styled-components';
// eslint-disable-next-line
export const Logo = styled.img`
  background-color: #283050;
  padding: 20px;
  margin-left: -20px;
  width: 200px;
`;


const menuConfig = [
  {
    pathname: '__back',
    title: 'Back to Dashboard',
    onClick: () => {
      // eslint-disable-next-line
      console.log('back to dashboard');
    },
    icon: 'left'
  },
  ...transformSchemaToMenuConfig({...schema.pageSchema, ...schema.schema})
]

class CMSExample extends React.Component {
  router = new R({
    baseUrl: "/docs"
  })

  componentDidMount() {
    this.unlisten = this.router.history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const customHeaderMenu = (
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px', display: 'inline-block' }}
        onClick={this.headerMenuOnClick}
        selectedKeys={[]}
      >
        <SubMenu title="Submenu">
          <Menu.Item theme="light" key="logout">
            MenuItem 1
          </Menu.Item>
        </SubMenu>
        <Menu.Item>
         MenuItem 1
        </Menu.Item>
      </Menu>
    )
    return (
      <Container
        schema={schema}
        sidebarConfig={{
          menuConfig
        }}
        navbarConfig={{
          logo: <Logo src="https://cdn.canner.io/cms-page/d89f77c19e5d3aa366ba1498dddd64ef.svg" />,
          showSaveButton: true,
          renderMenu: () => customHeaderMenu
        }}
        router={this.router}
      >
        <Canner
          afterDeploy={() => {
            notification.success({
              message: 'Deployed!'
            })
          }}
          errorHandler={e => {
            // eslint-disable-next-line no-console
            console.error(e);
            notification.error({
              message: 'Error'
            });
          }}
        />
      </Container>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));

