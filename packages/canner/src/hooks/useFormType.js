import {useState, useEffect} from 'react';
export const FORM_TYPE = {
  NONE: -1,
  LIST: 0,
  UPDATE: 1,
  CREATE: 2,
};

export default function useFormType({
  routes,
  schema,
  routerParams,
  goTo,
  defaultKey
}) {
  const [formType, setFormType] = useState(FORM_TYPE.NONE);
  const key = routes[0];
  const redirect = () => {
    goTo({
      pathname: `/${defaultKey || Object.keys(schema)[0]}`
    });
  }
  useEffect(() => {
    if (!key || !(key in schema)) {
      setFormType(FORM_TYPE.NONE)
      redirect();
      return;
    }
    if (routes.length === 1 && routerParams.operator === 'create') {
      setFormType(FORM_TYPE.CREATE);
    } else if (routes.length === 1 && routerParams.operator === 'update' && schema[key].type === 'array') {
      setFormType(FORM_TYPE.LIST);
    } else if (routes.length >= 1) {
      setFormType(FORM_TYPE.UPDATE);
    } else {
      setFormType(FORM_TYPE.NONE);
      redirect();
    }
  });
  return {
    isListForm: formType === FORM_TYPE.LIST,
    isCreateForm: formType === FORM_TYPE.CREATE,
    isUpdateForm: formType === FORM_TYPE.UPDATE,
    isNoneForm: formType === FORM_TYPE.NONE,
  }
}
