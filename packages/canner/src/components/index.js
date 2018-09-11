// @flow

import * as React from 'react';
import Provider from './Provider';
import Generator from './Generator';
import {notification} from 'antd';
import {createEmptyData} from 'canner-helpers';
import {Parser, Traverser} from 'canner-compiler';
import {createClient, MemoryConnector} from 'canner-graphql-interface';
import {isEmpty, isPlainObject} from 'lodash';
// i18n
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import {IntlProvider, addLocaleData} from 'react-intl';
import cannerLocales from './locale';
import componentLocales from '@canner/antd-locales';
addLocaleData([...en, ...zh]);

// type
import type {CMSProps, LoadedSchema} from './types';

type Props = CMSProps;
type State = {
  dataChanged: Object
};

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
      messages: {
        'en': {}
      }
    },
    routerParams: {},
    routes: []
  }

  constructor(props: Props) {
    super(props);
    const {schema, visitors, pageSchema} = props.schema;
    const mergedSchema = {
      ...pageSchema,
      ...schema
    }
    this.componentTree = compile(mergedSchema, visitors);
    this.schema = Object.keys(schema).reduce((result: any, key: string) => {
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
    this.state = {
      dataChanged: {}
    }
  }

  dataDidChange = (dataChanged: Object) => {
    const {dataDidChange} = this.props;
    if (dataDidChange) {
      dataDidChange(dataChanged);
    }
    this.setState({
      dataChanged
    });
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
      baseUrl,
      routes,
      routerParams,
      goTo,
      afterDeploy,
      intl = {},
      hideButtons,
      errorHandler,
      schema: {storages, dict = {}}
    } = this.props;
    const currentLocale = intl.locale || 'en';
    return (
      <IntlProvider
        locale={currentLocale}
        defaultLocale={intl.defaultLocale || currentLocale}
        messages={{
          ...(componentLocales[currentLocale] || {}),
          ...(cannerLocales[currentLocale] || {}),
          ...(dict[currentLocale] || {}),
          ...((intl.messages || {})[currentLocale] || {})
        }}
      >
        <Provider
          ref={provider => this.provider = provider}
          client={this.client}
          schema={this.schema}
          dataDidChange={this.dataDidChange}
          afterDeploy={afterDeploy}
          rootKey={routes[0]}
          errorHandler={errorHandler || defaultErrorHandler}
        >
          <Generator
            storages={storages}
            schema={this.schema}
            componentTree={this.componentTree || {}}
            goTo={goTo}
            baseUrl={baseUrl}
            routes={routes}
            routerParams={routerParams || {}}
            hideButtons={hideButtons}
          />
        </Provider>
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

export function genClient(schema: LoadedSchema) {
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
      defaultData: createEmptyData(schema.schema)
    });
  }

  if (!isEmpty(resolvers)) {
    options.resolvers = resolvers
  }
  return createClient(options);
}

export default CannerCMS;

function defaultErrorHandler(e) {
  return notification.error({
    message: e.message,
    placement: 'bottomRight'
  });
}
