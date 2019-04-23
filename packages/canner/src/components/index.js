// @flow

import * as React from 'react';
import Provider from './Provider';
import Generator from './Generator';
// $FlowFixMe: antd flow typed
import {notification} from 'antd';
import {Parser, Traverser} from 'canner-compiler';
import {pickBy} from 'lodash';
// i18n
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import {IntlProvider, addLocaleData} from 'react-intl';
import cannerLocales from './locale';
import componentLocales from '@canner/antd-locales';
addLocaleData([...en, ...zh]);

// type
import type {CMSProps} from './types';

type Props = CMSProps;

class CannerCMS extends React.Component<Props> {
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
    const uiSchema = {
      ...pageSchema,
      ...pickBy(schema, v => !v.defOnly)
    }
    this.componentTree = compile(uiSchema, visitors);
    this.schema = Object.keys(schema).reduce((result: any, key: string) => {
      let v = {...schema[key]};
      if (v.type === 'array' && v.items) {
        v.items.id = {
          type: 'id'
        }
      }
      result[key] = v;
      return result;
    }, {});
  }

  componentDidCatch(error: any) {
    const {errorHandler} = this.props;
    errorHandler && errorHandler(error);
  }

  dataDidChange = (dataChanged: Object) => {
    const {dataDidChange} = this.props;
    if (dataDidChange) {
      dataDidChange(dataChanged);
    }
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
      schema: {imageStorages, fileStorages, dict = {}},
      defaultKey,
      client,
      rules
    } = this.props;
    const currentLocale = intl.locale || 'en';
    return (
      <IntlProvider
        locale={currentLocale}
        key={currentLocale}
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
          client={client}
          schema={this.schema}
          dataDidChange={this.dataDidChange}
          afterDeploy={afterDeploy}
          rootKey={routes[0]}
          routes={routes}
          routerParams={routerParams || {}}
          errorHandler={errorHandler || defaultErrorHandler}
        >
          <Generator
            imageStorages={imageStorages}
            fileStorages={fileStorages}
            schema={this.schema}
            componentTree={this.componentTree || {}}
            goTo={goTo}
            baseUrl={baseUrl}
            routes={routes}
            rules={rules}
            routerParams={routerParams || {}}
            hideButtons={hideButtons}
            defaultKey={defaultKey}
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

function defaultErrorHandler(e) {
  return notification.error({
    message: e.message,
    placement: 'bottomRight'
  });
}

export default CannerCMS;
