// @flow

import * as React from 'react';
import Provider from './Provider';
import Generator from './Generator';
import type {Node} from './Generator';
import type Endpoint from '../app/endpoint';
import hocs from '../hocs';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import hocsLocales from '../hocs/query/locale';
import pluginsLocales from '@canner/cms-locales';
import queryString from 'query-string';
import defaultLayouts from '@canner/react-cms-containers';
import LocalStorage from '../app/endpoint/localstorage';
import {ImgurService} from '@canner/image-service-config';

const lang = 'zh';
addLocaleData([...en, ...zh]);


type Props = {
  schema: {
    cannerSchema: {[key: string]: any},
    componentTree: {[key: string]: Node}
  },
  endpoints: {[key: string]: Endpoint},
  dataDidChange: void => void,
  children: React.ChildrenArray<React.Node>,

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

class CannerCMS extends React.Component<Props> {
  endpoints: {
    [string]: Endpoint
  };

  imageServiceConfigs: Object

  static defaultProps = {
    schema: {
      cannerSchema: {},
      componentTree: {},
    },
    dataDidChange: () => {},
    componentTree: {},
    hocs,
    layouts: {},
    baseUrl: '/'
  }

  constructor(props: Props) {
    super(props);
      const {cannerSchema} = props.schema;
      const endpoint = new LocalStorage({
        schema: cannerSchema
      });
      this.endpoints = {...Object.keys(cannerSchema).reduce((result, key) => {
        result[key] = endpoint;
        return result;
      }, {}), ...(props.endpoints || {})};

      const serviceConfig = new ImgurService({
        // $FlowFixMe
        clientId: process.env.IMGUR_CLIENT_ID
      });

      this.imageServiceConfigs = {...Object.keys(cannerSchema).reduce((result, key) => {
        result[key] = serviceConfig;
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
      history
    } = this.props;
    const {location, push} = history;
    const {pathname} = location;
    const routes = getRoutes(pathname, baseUrl);
    const params = queryString.parse(location.search);
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
          schema={schema.cannerSchema}
          endpoints={this.endpoints}
          dataDidChange={dataDidChange}
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
