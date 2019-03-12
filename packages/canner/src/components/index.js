// @flow

import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {Parser, Traverser} from 'canner-compiler';
import {pickBy} from 'lodash';
import Generator from './Generator';
import ListForm from './form/ListForm';
import useProvider from '../hooks/useProvider';
import useListForm from '../hooks/useListForm';
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

export default forwardRef(CannerCMS);

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
  const uiSchema = {
    ...pageSchema,
    ...pickBy(dataSchema, v => !v.defOnly)
  }
  const componentTree = useRef(compile(uiSchema, visitors)).current;
  const currentLocale = intl.locale || 'en';
  const provider = useProvider({
    schema: dataSchema,
    routes,
    client,
    dataDidChange,
    errorHandler,
    afterDeploy
  });
  const {
    isListForm,
  } = useFormType({routes, routerParams, schema: dataSchema, goTo});
  const listForm = useListForm({provider, schema: dataSchema, routes, isListForm});
  useImperativeHandle(ref, () => ({
    deploy: provider.deploy,
    reset: provider.reset,
  }));
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
      <React.Fragment>
        {
          isListForm && <ListForm
            {...listForm}
            schema={dataSchema}
            baseUrl={baseUrl}
            goTo={goTo}
            routes={routes}
            routerParams={routerParams}
            defaultKey={defaultKey}
            hideButtons={hideButtons}
            componentTree={componentTree}
            imageStorage={imageStorages[routes[0]]}
            fileStorage={fileStorages[routes[0]]}
          >
            <Generator />
          </ListForm>
        }
      </React.Fragment>
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
  console.log(e);
  // return notification.error({
  //   message: e.message,
  //   placement: 'bottomRight'
  // });
}
