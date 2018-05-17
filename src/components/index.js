// @flow
/* global IMGUR_CLIENT_ID */

import * as React from 'react';
import queryString from 'query-string';
import defaultLayouts from '@canner/react-cms-layouts';
import {ImgurService} from '@canner/image-service-config';
import {MemoryConnector, createClient} from '@canner/graphql-resolver';
import {createEmptyData} from '@canner/react-cms-helpers';
import {isEmpty} from 'lodash';
import Provider from './Provider';
import Generator from './Generator';
import hocs from '../hocs';

// i18n
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import {IntlProvider, addLocaleData} from 'react-intl';
import hocsLocales from '../hocs/components/locale';
import pluginsLocales from '@canner/antd-locales';
const lang = 'zh';
addLocaleData([...en, ...zh]);

// type
import type ApolloClient from 'apollo-client';
import type {Node} from './Generator';

type Props = {
  schema: {
    cannerSchema: {[key: string]: any},
    componentTree: {[key: string]: Node},
    connector: any,
    connectors: ?Object,
    resolvers: ?Object
  },
  dataDidChange: void => void,
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
  }
}

type State = {
  connecting: boolean
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
    componentTree: {},
    hocs,
    layouts: {},
    baseUrl: '/',
  }

  constructor(props: Props) {
    super(props);
    let {cannerSchema, connector, connectors, resolvers} = props.schema;

    if (!connector && isEmpty(connectors)) {
      // use memory connector by default if no any connector given
      connector = new MemoryConnector({
        defaultData: createEmptyData(cannerSchema).toJS()
      });
    }

    this.client = createClient({
      schema: cannerSchema,
      connector,
      connectors,
      resolvers
    });
    const serviceConfig = new ImgurService({
      // $FlowFixMe: global
      clientId: IMGUR_CLIENT_ID
    });

    this.imageServiceConfigs = {...Object.keys(cannerSchema).reduce((result, key) => {
      result[key] = serviceConfig;
      return result;
    }, {}), ...(props.imageServiceConfigs || {})};
    this.state = {
      connecting: true
    };
  }

  render() {
    const {
      schema,
      dataDidChange,
      hocs,
      layouts,
      baseUrl,
      history,
    } = this.props;
    // const {connecting} = this.state;
    const {location, push} = history;
    const {pathname} = location;
    const routes = getRoutes(pathname, baseUrl);
    const params = queryString.parse(location.search);
    // if (connecting) {
    //   return <div>LOADING</div>;
    // }
    return (
      <IntlProvider
        locale={lang}
        defaultLocale={lang}
        key={lang}
        messages={{
          ...pluginsLocales[lang],
          ...hocsLocales[lang],
        }}
      >
        <Provider
          client={this.client}
          schema={schema.cannerSchema}
          dataDidChange={dataDidChange}
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
