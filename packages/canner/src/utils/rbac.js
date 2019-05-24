import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';
// @flow
type Rules = {
  [keyName: string]: Array<'create' | 'update' | 'delete' | 'read'>
}
export default function rbac({
  keyName,
  rules,
}: {
  keyName: string,
  rules?: Rules
}) {
  const result = {
    disabled: {
      create: false,
      update: false,
      delete: false,
    },
    hidden: false,
  };
  if (isEmpty(rules)) {
    return result;
  }
  const operations = rules[keyName];
  if (!operations) {
    return result;
  }

  if (!has(operations, 'read')) {
    result.hidden = true;
  }
  if (!has(operations, 'create')) {
    result.disabled.create = true;
  }
  if (!has(operations, 'update')) {
    result.disabled.update = true;
  }
  if (!has(operations, 'delete')) {
    result.disabled.delete = true;
  }
  return result;
}

function has(operations, type) {
  return operations.indexOf(type) > -1;
}

export function mergeDisabled(propsDisabled, rbacDisabled) {
  if (propsDisabled === true) {
    return {
      create: true,
      update: true,
      delete: true,
    };
  }

  if (isPlainObject(propsDisabled)) {
    return {
      create: propsDisabled.create || rbacDisabled.create,
      update: propsDisabled.update || rbacDisabled.update,
      delete: propsDisabled.delete || rbacDisabled.delete,
    };
  }
  return rbacDisabled;
}
