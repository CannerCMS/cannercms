import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  Menu, notification, Select, message, Alert
} from 'antd';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
// eslint-disable-next-line
import Container, {transformSchemaToMenuConfig} from 'packages/canner-container/src';
// eslint-disable-next-line
import R from 'packages/router/src';
// eslint-disable-next-line
import Canner from 'packages/canner/src';
import schema from './canner.schema';
import client from './client';

addLocaleData([...en, ...zh]);

const Option = Select.Option;
const menuConfig = [
  {
    title: 'Back to Canner',
    pathname: '__back',
    icon: 'left',
    onClick: () => { window.location.href = 'https://www.canner.io/'; },
  },
  ...transformSchemaToMenuConfig({ ...schema.pageSchema, ...schema.schema }),
].map((item) => {
  // eslint-disable-next-line no-param-reassign
  item.icon = item.icon || getIcon(item.pathname);
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
  router = new R({
    baseUrl: '/demo'
  });

  state = {
    locale: 'en'
  };

  constructor(props) {
    super(props);

    this.unlisten = this.router.history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unlisten();
  }

  changeLocale = (locale) => {
    this.setState({
      locale
    });
  }

  reset = () => {
    localStorage.clear();
    message.success('Reset data.', 1, () => { window.location.reload(); });
  }

  render() {
    const { locale } = this.state;
    const renderCustomHeaderMenu = ({ theme, mode }) => (
      <Menu theme={theme} mode={mode} selectedKeys={[]} style={{ lineHeight: '64px', display: mode === 'horizontal' ? 'inline-block' : 'block' }}>
        <Menu.Item>
          <Select style={{ width: 120 }} value={locale} onChange={this.changeLocale}>
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
          message={(
            <div>
              In less than 1500 lines of code you can build this demo (
              <a href="https://github.com/Canner/canner/tree/canary/docs/schema" target="_blank" rel="noopener noreferrer">
                  Source code
              </a>
              ). Please visit
              <a href="/">our homepage</a>
              .
            </div>
          )}
          banner
          type="info"
        />
        <IntlProvider locale={locale} key={locale} messages={schema.dict[locale]}>
          <Container
            schema={schema}
            sidebarConfig={{
              menuConfig,
              theme: 'dark',
              logo: {
                href: 'https://www.canner.io/',
                src: 'https://cdn.canner.io/images/logo/logo-word-white.png',
                backgroundColor: '#283050'
              },
            }}
            navbarConfig={{
              showSaveButton: true,
              renderMenu: renderCustomHeaderMenu,
              theme: 'dark'
            }}
            router={this.router}
          >
            <Canner
              ref={this.cms}
              afterDeploy={() => {
                notification.success({
                  message: 'Deployed!'
                });
              }}
              rules={JSON.parse(localStorage.getItem('CannerDemoRules') || '{}')}
              errorHandler={(e) => {
                // eslint-disable-next-line no-console
                console.error(e);
                notification.error({
                  message: 'Error'
                });
              }}
              intl={{
                locale
              }}
              client={client}
            />
          </Container>
        </IntlProvider>
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <CMSExample />,
  document.getElementById('root')
);
