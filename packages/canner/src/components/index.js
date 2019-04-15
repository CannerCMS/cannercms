// @flow

import React, {forwardRef, useImperativeHandle, useMemo} from 'react';
import {Parser, Traverser} from 'canner-compiler';
import {pickBy, isEqual} from 'lodash';
import { ApolloProvider } from 'react-apollo';
import Router from './Router';
// hooks
import useProvider from '../hooks/useProvider';
import useFormType from '../hooks/useFormType';
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

export default (React.memo(forwardRef(CannerCMS), function(prevProps, nextProps) {
  return Object.entries(nextProps).reduce((eq, [k, v]: any) => {
    return isEqual(v, prevProps[k]) && eq;
  }, true)
}): any);

function CannerCMS({
  schema,
  dataDidChange = () => {},
  afterDeploy = () => {},
  baseUrl = '/',
  intl = {
    locale: 'en',
    defaultLocale: 'en',
    messages: {
      'en': {}
    }
  },
  routerParams = {},
  routes = [],
  goTo,
  hideButtons,
  errorHandler = defaultErrorHandler,
  defaultKey,
  client
}: Props, ref) {
  const {visitors, pageSchema, imageStorages, fileStorages, dict} = schema;
  const dataSchema = schema.schema;
  const uiSchema = useMemo(() => ({
    ...pageSchema,
    ...pickBy(dataSchema, v => !v.defOnly)
  }), [pageSchema, dataSchema])
  const componentTree = useMemo(() => compile(uiSchema, visitors), [uiSchema, visitors]);
  const currentLocale = intl.locale || 'en';
  const provider = useProvider({
    schema: dataSchema,
    routes,
    client,
    dataDidChange,
    errorHandler,
    afterDeploy
  });
  const {formType} = useFormType({routes, routerParams, schema: uiSchema, defaultKey, goTo});
  useImperativeHandle(ref, () => ({
    deploy: provider.deploy,
    reset: provider.reset,
  }));
  const commonFormProps = useMemo(() => ({
    schema: dataSchema,
    baseUrl,
    goTo,
    routes,
    routerParams,
    defaultKey,
    hideButtons,
    componentTree,
    imageStorage: imageStorages[routes[0]],
    fileStorage: fileStorages[routes[0]],
  }), [dataSchema, routes, baseUrl, routerParams, componentTree]);
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
      <ApolloProvider client={client}>
        <Router uiSchema={uiSchema} provider={provider} commonFormProps={commonFormProps} formType={formType} />
      </ApolloProvider>
    </IntlProvider>
  )
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
  // eslint-disable-next-line no-console
  console.log(e);
  // return notification.error({
  //   message: e.message,
  //   placement: 'bottomRight'
  // });
}
