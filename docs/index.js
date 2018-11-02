import * as React from 'react';
import ReactDOM from 'react-dom';
import {Menu, notification, Select, message, Alert} from 'antd';
import {IntlProvider, addLocaleData} from 'react-intl';
import Canner from 'packages/canner/src';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import Container, {transformSchemaToMenuConfig} from 'packages/canner-container/src';
import R from 'packages/router/src';

import schema from './canner.schema';
import styled from 'styled-components';
addLocaleData([...en, ...zh]);

// eslint-disable-next-line
export const Logo = styled.img`
  padding: 20px;
  margin-left: -20px;
  width: 200px;
`;

const Option = Select.Option;
const menuConfig = [
  ...transformSchemaToMenuConfig({...schema.pageSchema, ...schema.schema})
].map(item => {
  item.icon = getIcon(item.pathname);
  return item;
});

function getIcon(pathname) {
  switch (pathname) {
    case '/dashboard':
      return 'dashboard';
    case '/products':
      return 'shopping-cart';
    case '/categories':
      return 'tags';
    case '/home':
      return 'home';
    case '/orders':
      return 'solution';
    case '/customers':
      return 'team';
    default:
      return 'folder';
  }
}

class CMSExample extends React.Component {
  constructor(props) {
    super(props);

    this.unlisten = this.router.history.listen(() => this.forceUpdate());
  }

  router = new R({
    baseUrl: "/demo"
  });

  state = {
    locale: 'en'
  };

  componentWillUnmount() {
    this.unlisten();
  }

  changeLocale = locale => {
    this.setState({
      locale
    });
  }

  reset = () => {
    localStorage.clear();
    message.success('Reset data.', 1, () => location.reload());
  }

  render() {
    const {locale} = this.state;
    const renderCustomHeaderMenu = ({mode}) => (
      <Menu theme="dark" mode={mode} selectedKeys={[]} style={{ lineHeight: '64px', display: mode === 'horizontal' ? 'inline-block' : 'block' }}>
        <Menu.Item>
          <Select style={{width: 120}} value={locale} onChange={this.changeLocale}>
            <Option value="zh">
              中文
            </Option>
            <Option value="en">
              English
            </Option>
          </Select>
        </Menu.Item>
        <Menu.Item onClick={this.reset}>
          <span>Reset</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <React.Fragment>
        <Alert
          message={
            <div>
              This is a demo version. Please visit <a href="/">our homepage</a>. 
            </div>
          }
          banner
          type="info"
        />
        <IntlProvider locale={locale} key={locale} messages={schema.dict[locale]}>
        
          <Container
            schema={schema}
            sidebarConfig={{
              menuConfig
            }}
            navbarConfig={{
              logo: <Logo src="https://cdn.canner.io/images/logo/logo-white-word-beta.svg" />,
              showSaveButton: true,
              renderMenu: renderCustomHeaderMenu
            }}
            router={this.router}
          >
            <Canner
              ref={this.cms}
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
              intl={{
                locale
              }}
            />
          </Container>
        </IntlProvider>
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));

