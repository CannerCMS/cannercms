// @flow

import {
  useState, useEffect, useRef, useCallback
} from 'react';
import Ajv from 'ajv';
import type RefId from 'canner-ref-id';
import { isPlainObject, get, isArray } from 'lodash';

export default ({
  value,
  required,
  validation = {},
}: {
  value: any,
  required: boolean,
  validation: any
}) => {
  const [error, setError] = useState(false);
  const errorInfoRef = useRef([]);
  const validate = useCallback(() => {
    // required
    const isRequiredValid = required ? Boolean(value) : true;

    // Ajv validation
    const ajv = new Ajv();
    const validate = ajv.compile(validation);

    // custom validator
    const { validator, errorMessage } = validation;
    const reject = message => ({ error: true, message });
    const validatorResult = validator && validator(value, reject);

    const customValid = !(validatorResult && validatorResult.error);
    // if value is empty, should not validate with ajv
    if (customValid && isRequiredValid && (!value || validate(value))) {
      setError(false);
      errorInfoRef.current = [];
      return;
    }

    // TODO: fix type
    const errorInfo: any = []
      .concat(isRequiredValid ? [] : {
        message: 'should be required',
      })
      // eslint-disable-next-line
      .concat(validate.errors ? (errorMessage ? { message: errorMessage } : validate.errors) : [])
      .concat(customValid ? [] : validatorResult);

    setError(true);
    errorInfoRef.current = errorInfo;
  }, [value, required, validation]);
  useEffect(() => {
    validate();
  }, [validate]);
  return {
    error,
    errorInfo: errorInfoRef.current,
  };
};


export function splitRefId({
  refId,
  rootValue,
  pattern,
}: {
  refId: RefId,
  rootValue: any,
  pattern: string
}) {
  const [key, index] = refId.getPathArr();
  let id;
  if (pattern.startsWith('array')) {
    id = get(rootValue, [key, index, 'id']);
  }
  return {
    key,
    id,
  };
}

export function getValueAndPaths(value: Object, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    let v = result.value;
    let paths = result.paths;
    if (isPlainObject(v)) {
      if ('edges' in v && 'node' in v.edges[key]) {
        v = get(v, ['edges', key, 'node']);
        paths = paths.concat(['edges', key, 'node']);
      } else {
        v = v[key];
        paths = paths.concat(key);
      }
    } else if (isArray(v)) {
      v = v[key];
      paths = paths.concat(key);
    }
    return {
      value: v,
      paths,
    };
  }, {
    value,
    paths: [],
  });
}
