import * as React from 'react';
import {Layout, notification, Modal} from 'antd';
import Canner from 'canner';
import Container, {transformSchemaToMenuConfig} from '@canner/container';
import R from '@canner/history-router';
import Error from './Error';
import styled from 'styled-components';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ContentHeader from './Header';

const confirm = Modal.confirm;

type Props = {
  history: Object,
  match: Object,
  location: Object,
  intl: {
    locale?: string,
    messages?: Object
  }
};

type State = {
  hasError: boolean,
  prepare: boolean,
  client: ApolloClient<any>
}

export default class CMSPage extends React.Component<Props, State> {
  client: ApolloClient<any>;

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      prepare: false,
      client: null
    };
  }

  async componentDidMount() {
    const client = await this.createClient();
    this.setState({
      prepare: true,
      client
    });
    
  }

  createClient = async (): Promise<ApolloClient<any>> => {
    const token = await getAccessToken();
    const link: any =  createHttpLink({
      uri: ((window as any).config && (window as any).config.graphqlEndpoint) || `/graphql`,
      headers: token ?
        { Authorization: `Bearer ${token}` } :
        {},
    });
    return new ApolloClient({
      cache: new InMemoryCache(),
      link
    });
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    console.log(error, info);
  }

  handleClickResetButton = () => {
    confirm({
      title: 'Do you want to reset all data?',
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        localStorage.removeItem(schema.connector.localStorageKey);
        location.reload();
      },
      onCancel: () => {
      },
    });
    
  }

  render() {
    const { history, intl } = this.props;
    const { prepare, hasError, client } = this.state;
    if (hasError) return <Error />;

    if (!prepare) return null;
    const {
      schema,
      cmsConfig = {}
    } = window as any;
    const cmsStyle = cmsConfig.style || {};
    const sidebar =
      cmsConfig.sidebarMenu || transformSchemaToMenuConfig({...schema.pageSchema, ...schema.schema});
    const defaultLogo = (theme) => ({
      src: theme === 'dark' ? 'https://cdn.canner.io/images/logo/logo-word-white.png': 'https://cdn.canner.io/images/logo/logo-word.png',
      width: '150px',
      href: '#'
    })
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Container
          schema={schema}
          sidebarConfig={{
            menuConfig: [...sidebar],
            theme: cmsStyle.sidebarTheme,
            mode: cmsStyle.sidebarMode,
            style: cmsStyle.sidebarStyle,
            menuStyle: cmsStyle.sidebarMenuStyle,
            logo: cmsConfig.logo || defaultLogo,
          }}
          navbarConfig={{
            showSaveButton: 'showSaveButton' in cmsConfig ? cmsConfig.showSaveButton : true,
            theme: cmsStyle.navbarTheme,
            style: cmsStyle.navbarStyle,
            menuStyle: cmsStyle.navbarMenuStyle,
            renderMenu: ({theme}) => (
              <ContentHeader
                theme={theme}
                user={{
                  username: ((window as any).config || {}).username
                }}
                location={location}
                history={history}
                style={cmsStyle.navbarMenuStyle}
              />
            ),
  
          }}
          router={
            new R({
              history,
              baseUrl: baseUrl === '/' ? '' : (baseUrl || '')
            })
          }
        >
          <Canner
            schema={schema}
            afterDeploy={() => {
              notification.success({
                placement: "bottomRight",
                message: "Successfully Updated!",
                description: ""
              });
            }}
            intl={intl}
            client={client}
          />
        </Container>
      </Layout>
    );
  }
}
