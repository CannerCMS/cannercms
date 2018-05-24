// @flow
/* global IMGUR_CLIENT_ID */

import * as React from 'react';
import queryString from 'query-string';
import {isEmpty} from 'lodash';
import Provider from './Provider';
import Generator from './Generator';
import hocs from '../hocs';

import defaultLayouts from 'canner-layouts';
import {ImgurService} from '@canner/image-service-config';
import {createClient, MemoryConnector} from 'canner-graphql-interface';
import {createEmptyData} from 'canner-helpers';

// i18n
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import {IntlProvider, addLocaleData} from 'react-intl';
import hocsLocales from '../hocs/components/locale';
import pluginsLocales from '@canner/antd-locales';
addLocaleData([...en, ...zh]);

// type
import type ApolloClient from 'apollo-client';
import type {Node} from './Generator';

type Props = {
  schema: {
    cannerSchema: {[key: string]: any},
    componentTree: {[key: string]: Node},
  },
  connector: any,
  resolver: ?Object,
  dataDidChange: void => void,
  afterDeploy: void => void,
  children: React.ChildrenArray<React.Node>,
  client: ApolloClient,
  imageServiceConfigs: Object,
  componentTree: {[string]: Node},
  hocs: {[string]: React.ComponentType<*>},
  layouts: {[string]: React.ComponentType<*>},
  goTo: (path: string) => void,
  baseUrl: string,

  history: {
    push: (path: string) => void,
    location: Object
  },
  intl: {
    locale: string,
    defaultLocale: string,
    message: Object
  }
}

type State = {
}

class CannerCMS extends React.Component<Props, State> {
  imageServiceConfigs: Object
  client: Client;
  endpoints: {[key: string]: any};

  static defaultProps = {
    schema: {
      cannerSchema: {},
      componentTree: {},
    },
    dataDidChange: () => {},
    afterDeploy: () => {},
    componentTree: {},
    hocs,
    layouts: {},
    baseUrl: '/',
    connector: {},
    resolver: {},
    intl: {
      locale: 'en',
      defaultLocale: 'en',
      messages: {}
    }
  }

  constructor(props: Props) {
    super(props);
    const {cannerSchema} = props.schema;
    const {connector = {}, resolver} = props;
    let defaultConnector = connector.__default;
    let connectors = {...connector};
    delete connectors.__default;
    if (!defaultConnector && isEmpty(connectors)) {
      // use memory connector by default if no any connector given
      defaultConnector = new MemoryConnector({
        defaultData: createEmptyData(cannerSchema).toJS()
      });
    }
    const fixSchema = Object.keys(cannerSchema).reduce((result, key) => {
      let v = {...cannerSchema[key]};
      if (v.type === 'array') {
        // v.items = v.items.items;
        v.items.id = {
          type: 'id'
        }
      }
      result[key] = v;
      return result;
    }, {});

    const options: any = {schema: fixSchema, resolvers: resolver};
    if (defaultConnector) {
      options.connector = defaultConnector;
    }
    if (!isEmpty(connectors)) {
      options.connectors = connectors;
    }
    this.client = createClient(options);
    const serviceConfig = new ImgurService({
      // $FlowFixMe: global
      clientId: IMGUR_CLIENT_ID
    });

    this.imageServiceConfigs = {...Object.keys(cannerSchema).reduce((result, key) => {
      result[key] = serviceConfig.getServiceConfig();
      return result;
    }, {}), ...(props.imageServiceConfigs || {})};
    
  }

  render() {
    const {
      schema,
      dataDidChange,
      hocs,
      layouts,
      baseUrl,
      history,
      afterDeploy,
      intl = {}
    } = this.props;
    const {location, push} = history;
    const {pathname} = location;
    const routes = getRoutes(pathname, baseUrl);
    const params = queryString.parse(location.search);

    return (
      <IntlProvider
        locale={intl.lang || 'en'}
        defaultLocale={intl.lang || 'en'}
        messages={{
          ...pluginsLocales[intl.lang || 'en'],
          ...hocsLocales[intl.lang || 'en'],
        }}
      >
        <Provider
          client={this.client}
          schema={schema.cannerSchema}
          dataDidChange={dataDidChange}
          afterDeploy={afterDeploy}
          rootKey={routes[0]}
        >
          <Generator
            imageServiceConfigs={this.imageServiceConfigs}
            componentTree={schema.componentTree}
            hocs={hocs}
            layouts={{...defaultLayouts, ...layouts}}
            goTo={push}
            baseUrl={baseUrl}
            routes={routes}
            params={params}
          />
        </Provider>
      </IntlProvider>
    );
  }
}

function getRoutes(pathname, baseUrl = '/') {
  let pathnameWithoutBaseUrl = pathname.substring(baseUrl.length);
  if (pathnameWithoutBaseUrl[0] === '/') {
    pathnameWithoutBaseUrl = pathnameWithoutBaseUrl.substring(1);
  }
  return pathnameWithoutBaseUrl.split('/');
}

export default CannerCMS;
