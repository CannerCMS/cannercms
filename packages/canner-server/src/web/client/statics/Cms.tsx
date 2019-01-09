import * as React from 'react';
import {Layout, notification, Modal, Button} from 'antd';
import Canner from 'canner';
import Container, {transformSchemaToMenuConfig} from '@canner/container';
import R from '@canner/history-router';
import Error from './Error';
import styled from 'styled-components';
import {
  LocalStorageConnector,
} from 'canner-graphql-interface';
import { createHttpLink } from 'apollo-link-http';

const confirm = Modal.confirm;

export const Logo = styled.img`
  padding: 20px 0;
  width: 160px;
`;

type Props = {
  history: Object,
  match: Object,
  location: Object
};

type State = {
  hasError: boolean,
  prepare: boolean
}

export default class CMSPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      prepare: false
    };
  }

  async componentDidMount() {
    const token = await window.getAccessToken();
    setApolloClient(window.schema, token);
    this.setState({ prepare: true });
    
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
    const { history } = this.props;
    const { prepare, hasError } = this.state;
    if (hasError) return <Error />;

    if (!prepare) return null;
    const {
      schema,
      cloudConfig
    } = window;

    const sidebar =
      cloudConfig.sidebarMenu || transformSchemaToMenuConfig({...schema.pageSchema, ...schema.schema});

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Container
          schema={schema}
          sidebarConfig={{
            menuConfig: [...sidebar],
            theme: cloudConfig.sidebarTheme,
            mode: cloudConfig.sidebarMode,
            style: cloudConfig.sidebarStyle,
            menuStyle: cloudConfig.sidebarMenuStyle
          }}
          navbarConfig={{
            renderMenu: ({theme}) => (
              (schema.connector instanceof LocalStorageConnector) && <Button onClick={this.handleClickResetButton} key="reset" ghost={theme === 'dark'}>Reset</Button>
            ),
            showSaveButton: true,
            logo: <Logo src={cloudConfig.logo || 'https://cdn.canner.io/images/logo/logo-word-white.png'} />,
            theme: cloudConfig.navbarTheme,
            style: cloudConfig.navbarStyle,
            menuStyle: cloudConfig.navbarMenuStyle
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
          />
        </Container>
      </Layout>
    );
  }
}

function setApolloClient(schema: any, token?: string) {
  delete schema.connector;
  const options: any = {
    uri: 'http://localhost:1234/graphql',
  }
  if (token) {
    options.headers = {
      Authentication: `Bearer ${token}`
    };
  }
  schema.graphqlClient = createHttpLink(options);
}