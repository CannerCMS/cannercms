// @flow

/* eslint-disable import/no-duplicates */
import * as React from 'react';
import { useContext } from 'react';
/* eslint-enable import/no-duplicates */
import { Context } from 'canner-helpers';
import { FORM_TYPE } from 'canner/src/hooks/useFormType';

import { DefaultCreateBody, DefaultListBody, DefaultUpdateBody } from './defaultBody';

type Props = {
  id: string,
  title: string,
  description: string,
  schema: Object,
  routes: Array<string>,

  createComponent?: React.ComponentType<Props>,
  listComponent?: React.ComponentType<Props>,
  updateComponent?: React.ComponentType<Props>,
};

export default function Body({
  createComponent,
  listComponent,
  updateComponent,
  ...restProps
}: Props) {
  const { formType } = useContext(Context);
  let RenderBody = DefaultListBody;

  if (formType === FORM_TYPE.CREATE) {
    RenderBody = createComponent || DefaultCreateBody;
  }

  if (formType === FORM_TYPE.LIST) {
    RenderBody = listComponent || DefaultListBody;
  }

  if (formType === FORM_TYPE.UPDATE) {
    RenderBody = updateComponent || DefaultUpdateBody;
  }

  return <RenderBody {...restProps} />;
}

Body.defaultProps = {
  createComponent: null,
  listComponent: null,
  updateComponent: null,
};
