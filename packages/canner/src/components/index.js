// @flow

import React, {useRef, forwardRef, useImperativeHandle, useMemo} from 'react';
import {Parser, Traverser} from 'canner-compiler';
import {pickBy} from 'lodash';
import { ApolloProvider } from 'react-apollo';
import Generator from './Generator';
import ListForm from './form/ListForm';
import UpdateForm from './form/UpdateForm';
import CreateForm from './form/CreateForm';
import Page from './form/Page';
// hooks
import useProvider from '../hooks/useProvider';
import useListForm from '../hooks/useListForm';
import useUpdateForm from '../hooks/useUpdateForm';
import useCreateForm from '../hooks/useCreateForm';
import useFormType, {FORM_TYPE} from '../hooks/useFormType';
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
  const {
    isListForm,
    isUpdateForm,
    isCreateForm,
    isPage
  } = useFormType({routes, routerParams, schema: uiSchema, defaultKey, goTo});
  const listFormProps = useListForm({provider, schema: uiSchema, routes, isListForm});
  const updateFormProps = useUpdateForm({provider, schema: uiSchema, routes, isUpdateForm});
  const createFormProps = useCreateForm({provider, schema: uiSchema, routes, isCreateForm});
  useImperativeHandle(ref, () => ({
    deploy: provider.deploy,
    reset: provider.reset,
  }));
  const commonFormProps = {
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
  };
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
        <React.Fragment>
          {
            isListForm && <ListForm
              {...commonFormProps}
              {...listFormProps}
            >
              <Generator formType={FORM_TYPE.LIST} />
            </ListForm>
          }
          {
            isUpdateForm && <UpdateForm
              {...commonFormProps}
              {...updateFormProps}
            >
              <Generator formType={FORM_TYPE.UPDATE} />
            </UpdateForm>
          }
          {
            isCreateForm && <CreateForm
              {...commonFormProps}
              {...createFormProps}
            >
              <Generator formType={FORM_TYPE.CREATE} />
            </CreateForm>
          }
          {
            isPage && <Page {...commonFormProps}>
              <Generator formType={FORM_TYPE.PAGE} />
            </Page>
          }
        </React.Fragment>
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
  console.log(e);
  // return notification.error({
  //   message: e.message,
  //   placement: 'bottomRight'
  // });
}
