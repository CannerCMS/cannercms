// @flow

import * as React from 'react';
import Provider from './Provider';
import Generator from './Generator';
import Sidebar from './Sidebar';
import {Layout} from 'antd';
import hocs from '../hocs';
import {createEmptyData} from 'canner-helpers';
import {Parser, Traverser} from 'canner-compiler';
import {createClient, MemoryConnector} from 'canner-graphql-interface';
import {isEmpty, isPlainObject} from 'lodash';
// i18n
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import {IntlProvider, addLocaleData} from 'react-intl';
import hocsLocales from '../hocs/components/locale';
import pluginsLocales from '@canner/antd-locales';
addLocaleData([...en, ...zh]);

// type
import type {CMSProps} from './types';

type Props = CMSProps;
type State = {
}

class CannerCMS extends React.Component<Props, State> {
  imageServiceConfigs: Object
  client: Client;
  provider: ?Provider;
  componentTree: any;
  schema: any;

  static defaultProps = {
    schema: {
      schema: {}
    },
    dataDidChange: () => {},
    afterDeploy: () => {},
    baseUrl: '/',
    intl: {
      locale: 'en',
      defaultLocale: 'en',
      messages: {}
    }
  }

  constructor(props: Props) {
    super(props);
    const {schema, visitors} = props.schema;
    this.componentTree = compile(schema, visitors);
    this.schema = Object.keys(schema).reduce((result, key) => {
      let v = {...schema[key]};
      if (v.type === 'array') {
        // v.items = v.items.items;
        v.items.id = {
          type: 'id'
        }
      }
      result[key] = v;
      return result;
    }, {});
    this.client = genClient({...props.schema, schema: schema});
  }

  deploy = (key: string, id?: string): Promise<*> => {
    if (this.provider) {
      return this.provider.deploy(key, id);
    }
    return Promise.resolve();
  }

  reset = (key: string, id?: string): Promise<*> => {
    if (this.provider) {
      return this.provider.reset(key, id);
    }
    return Promise.resolve();
  }

  render() {
    const {
      dataDidChange,
      baseUrl,
      routes,
      params,
      goTo,
      afterDeploy,
      intl = {},
      hideButtons,
      schema: {storages}
    } = this.props;

    const sidebar = []

    return (
      <IntlProvider
        locale={intl.locale || 'en'}
        defaultLocale={intl.defaultLocale || intl.locale || 'en'}
        messages={{
          ...pluginsLocales[intl.locale || 'en'],
          ...hocsLocales[intl.lang || 'en'],
          ...(intl.messages || {})
        }}
      >
        <Layout>
          <Sidebar
            sidebar={sidebar}
            goTo={goTo}
            schema={this.schema}
          />
          <Layout.Content>
            <Provider
              ref={provider => this.provider = provider}
              client={this.client}
              schema={this.schema}
              dataDidChange={dataDidChange}
              afterDeploy={afterDeploy}
              rootKey={routes[0]}
            >
              <Generator
                storages={storages}
                componentTree={this.componentTree || {}}
                hocs={hocs}
                goTo={goTo}
                baseUrl={baseUrl}
                routes={routes}
                params={params}
                hideButtons={hideButtons}
              />
            </Provider>
          </Layout.Content>
        </Layout>
      </IntlProvider>
    );
  }
}

function compile(schema, visitors) {
  const parser = new Parser();
  const tree = parser.parse(schema);
  const traverser = new Traverser(tree);
  visitors.forEach(visitor => {
    traverser.addVisitor(visitor);
  });
  const componentTree = traverser.traverse();
  return componentTree;
}

export function genClient(schema) {
  const {
    resolvers,
    connector,
    graphqlClient,
  } = schema;

  const options: Object = {
    schema: schema.schema
  };

  if (connector) {
    if (isPlainObject(connector)) {
      if (!isEmpty(connector)) {
        options.connectors = connector
      }
    } else {
      options.connector = connector;
    }
  }

  if (graphqlClient) {
    if (isPlainObject(graphqlClient)) {
      if (!isEmpty(connector)) {
        options.graphqlClients = graphqlClient;
      }
    } else {
      options.graphqlClient = graphqlClient;
    }
  }

  if (isEmpty(connector) && isEmpty(graphqlClient)) {
    options.connector = new MemoryConnector({
      defaultData: createEmptyData(schema.schema).toJS()
    });
  }

  if (!isEmpty(resolvers)) {
    options.resolvers = resolvers
  }
  return createClient(options);
}

export default CannerCMS;
