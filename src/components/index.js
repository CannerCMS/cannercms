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

const lang = 'zh';
addLocaleData([...en, ...zh]);


type Props = {
  schema: {
    cannerSchema: {[key: string]: any},
    componentTree: {[key: string]: Node}
  },
  endpoint: {[key: string]: Endpoint},
  dataDidChange: void => void,
  children: React.ChildrenArray<React.Node>,

  imageServiceConfigs: Object,
  componentTree: {[string]: Node},
  hocs: {[string]: React.ComponentType<*>},
  layouts: {[string]: React.ComponentType<*>},
  goTo: (path: string) => void,
  baseUrl: string,
}

class CannerCMS extends React.Component<Props> {
  static defaultProps = {
    schema: {
      cannerSchema: {},
      componentTree: {},
    },
    endpoint: {},
    dataDidChange: () => {},
    componentTree: {},
    hocs,
    layouts: {},
    goTo: () => {},
    baseUrl: '/'
  }

  render() {
    const {
      schema,
      dataDidChange,
      hocs,
      layouts,
      goTo,
      baseUrl,
      endpoint,
      imageServiceConfigs
    } = this.props;
    const {pathname} = location;
    const routes = getRoutes(pathname, baseUrl);
    const params = queryString.parse(location.search)
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
          endpoint={endpoint}
          dataDidChange={dataDidChange}
        >
        
          <Generator
            imageServiceConfigs={imageServiceConfigs}
            componentTree={schema.componentTree}
            hocs={hocs}
            layouts={layouts}
            goTo={goTo}
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
