import {useEffect} from 'react';
export const FORM_TYPE = {
  NONE: 'NONE',
  LIST: 'LIST',
  UPDATE: 'UPDATE',
  CREATE: 'CREATE',
  PAGE: 'PAGE'
};

export default function useFormType({
  routes,
  schema,
  routerParams,
  goTo,
  defaultKey
}) {
  const key = routes[0];
  const redirect = () => {
    goTo({
      pathname: `/${defaultKey || Object.keys(schema)[0]}`
    });
  }
  let formType = FORM_TYPE.NONE;
  if (!key || !(key in schema)) {
    formType = FORM_TYPE.NONE;
  } else if (routes.length === 1 && routerParams.operator === 'create') {
    formType = FORM_TYPE.CREATE;
  } else if (routes.length === 1 && routerParams.operator === 'update' && schema[key].type === 'array') {
    formType = FORM_TYPE.LIST;
  } else if (routes.length >= 1 && ( schema[key].type === 'array' || schema[key].type === 'object')) {
    formType = FORM_TYPE.UPDATE;
  } else if (routes.length >= 1 && schema[key].type === 'page') {
    formType = FORM_TYPE.PAGE;
  } else {
    formType = FORM_TYPE.NONE;
  }
  useEffect(() => {
    if (!key || !(key in schema)) {
      redirect();
      return;
    }
  }, [key]);
  return {
    formType
  }
}
