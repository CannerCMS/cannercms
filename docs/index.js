import * as React from 'react';
import ReactDOM from 'react-dom';
import {Menu} from 'antd';
const SubMenu = Menu.SubMenu;
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Canner from 'packages/canner/src';
import Container, {transformSchemaToMenuConfig} from 'packages/canner-container/src';
import R from 'packages/history-router/src';
import schema from './canner.schema';
import styled from 'styled-components';
// eslint-disable-next-line
export const Logo = styled.img`
  background-color: #283050;
  padding: 20px;
  margin-left: -20px;
  width: 200px;
`
class CMSExample extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const baseUrl = "/docs";
    // eslint-disable-next-line
    return (
      <Router>
        <div>
          <Route path="/docs" render={({history}) => {
            return (
              <Container
                schema={schema}
                sidebarConfig={{
                  menuConfig: [
                    {
                      pathname: '__back',
                      title: 'Back to Dashboard',
                      onClick: () => {
                        // eslint-disable-next-line
                        console.log('back to dashboard');
                      },
                      icon: 'left'
                    },
                    ...transformSchemaToMenuConfig(schema.schema)
                  ]
                }}
                navbarConfig={{
                  logo: <Logo src="https://cdn.canner.io/cms-page/d89f77c19e5d3aa366ba1498dddd64ef.svg" />,
                  showSaveButton: true,
                  renderMenu: () => (<Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ lineHeight: '64px', display: 'inline-block' }}
                    onClick={this.headerMenuOnClick}
                    selectedKeys={[]}
                  ><SubMenu title="submenu">
                    <Menu.Item theme="light" key="logout">
                      menuitem
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item>
                    menuitem
                  </Menu.Item></Menu>)
                }}
                router={new R({
                  history,
                  baseUrl
                })}
              >
                <Canner/>
              </Container>
            );
          }}/>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));
