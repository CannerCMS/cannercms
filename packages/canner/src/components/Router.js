import React from 'react';
import useListForm from '../hooks/useListForm';
import useUpdateForm from '../hooks/useUpdateForm';
import useCreateForm from '../hooks/useCreateForm';
import Generator from './Generator';
import ListForm from './form/ListForm';
import UpdateForm from './form/UpdateForm';
import CreateForm from './form/CreateForm';
import Page from './form/Page';
import { FORM_TYPE } from '../hooks/useFormType';

export default function Router({
  provider,
  formType,
  uiSchema,
  commonFormProps,
}) {
  const { routes } = commonFormProps;
  const isCreateForm = formType === FORM_TYPE.CREATE;
  const isUpdateForm = formType === FORM_TYPE.UPDATE;
  const isListForm = formType === FORM_TYPE.LIST;
  const isPage = formType === FORM_TYPE.PAGE;
  const listFormProps = useListForm({
    provider, schema: uiSchema, routes, isListForm,
  });
  const updateFormProps = useUpdateForm({
    provider, schema: uiSchema, routes, isUpdateForm,
  });
  const createFormProps = useCreateForm({
    provider, schema: uiSchema, routes, isCreateForm,
  });

  return (
    <React.Fragment>
      {
        isListForm && (
        <ListForm
          {...commonFormProps}
          {...listFormProps}
          formType={FORM_TYPE.LIST}
        >
          <Generator formType={FORM_TYPE.LIST} />
        </ListForm>
        )
      }
      {
        isUpdateForm && (
        <UpdateForm
          {...commonFormProps}
          {...updateFormProps}
          formType={FORM_TYPE.UPDATE}
        >
          <Generator formType={FORM_TYPE.UPDATE} />
        </UpdateForm>
        )
      }
      {
        isCreateForm && (
        <CreateForm
          {...commonFormProps}
          {...createFormProps}
          formType={FORM_TYPE.CREATE}
        >
          <Generator formType={FORM_TYPE.CREATE} />
        </CreateForm>
        )
      }
      {
        isPage && (
        <Page {...commonFormProps} formType={FORM_TYPE.PAGE}>
          <Generator formType={FORM_TYPE.PAGE} />
        </Page>
        )
      }
    </React.Fragment>
  );
}
