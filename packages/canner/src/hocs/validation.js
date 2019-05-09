// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import Ajv from 'ajv';
import {isEmpty, isObject, isArray, isPlainObject, isFunction, get} from 'lodash';
import type {HOCProps} from './types';

type State = {
  error: boolean,
  errorInfo: Array<any>
}

const _isRequiredValidation = async (value) => {
  const valid = Boolean(value)
  return {
    error: !valid,
    errorInfo: !valid ? [{message: 'should be required'}] :[]
  }
}

const checkValidation = (validation) => {
  return (isObject(validation) && !isEmpty(validation))
}

const checkSchema = (schema) => {
  return (isObject(schema) && !isEmpty(schema) )
}
const checkValidator = (validator) => {
  return (isFunction(validator))
}

const _schemaValidation = (schema, errorMessage) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return async (value) => {
    try {
      const error = !validate(value)
      const errorInfo = error ? [].concat( errorMessage ? {message: errorMessage} : validate.errors ) : []
      return {
        error,
        errorInfo
      }
    }
    catch(err){
      return {
        error: true,
        errorInfo: [{message: err}]
      }
    }

  }
}
const _customizedValidator = (validator) => async (value) => {
  try {
    const errorMessage = await validator(value)
    return {
      error: Boolean(errorMessage),
      errorInfo: [{message: errorMessage}]
    }
  }
  catch(err) {
    return {
      error: true,
      errorInfo: [{message: err}]
    }
  }
}

export default function withValidation(Com: React.ComponentType<*>) {
  return class ComponentWithValidation extends React.Component<HOCProps, State> {
    key: string;
    id: ?string;
    callbackId: ?string;
    state = {
      error: false,
      errorInfo: []
    }

    componentDidMount() {
      const {refId, validation = {}, onDeploy, required = false} = this.props;
      if (isEmpty(validation) && !required) {
        // no validation
        return;
      }
      const key = refId.getPathArr()[0];
      this.callbackId = onDeploy(key, this.validate);
    }

    componentWillUnmount() {
      this.removeOnDeploy();
    }

    handleValidationResult = (results: any) => {

      let error = false;
      let errorInfo = [];

      for(let index = 0; index < results.length; index++) {
        error = error || results[index].error
        errorInfo = errorInfo.concat(results[index].errorInfo);
      }

      this.setState({
        error,
        errorInfo
      });

      return {
        error,
        errorInfo
      }
    }

    validate = async (result: any) => {
      const {refId, required = false, validation} = this.props;
      // required
      const paths = refId.getPathArr().slice(1);
      const {value} = getValueAndPaths(result.data, paths);
      const promiseQueue = [];

      // check whether value is required in first step
      if(required) {
        promiseQueue.push(_isRequiredValidation(value));
      }

      // skip validation if object validation is undefined or empty
      if(checkValidation(validation)) {
        const {schema, errorMessage, validator} = validation;
        if(value && checkSchema(schema)) {
          promiseQueue.push(_schemaValidation(schema, errorMessage)(value));
        }
        if(checkValidator(validator)) {
          promiseQueue.push(_customizedValidator(validator)(value));
        }
      }

      const ValidationResult = await Promise.all(promiseQueue);

      return {
        ...result,
        ...this.handleValidationResult(ValidationResult)
      }
    }

    removeOnDeploy = () => {
      const {refId, removeOnDeploy} = this.props;
      if (this.callbackId) {
        removeOnDeploy(refId.getPathArr()[0], this.callbackId || '');
      }
    }
    

    render() {
      const {error, errorInfo} = this.state;
      return <React.Fragment>
        <Com {...this.props} error={error} errorInfo={errorInfo || []}/>
      </React.Fragment>
  }
  };
}

export function splitRefId({
  refId,
  rootValue,
  pattern
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
    id
  }
}

export function getValueAndPaths(value: Object, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    let v = result.value;
    let paths = result.paths;
    if (isPlainObject(v)) {
      if ('edges' in v && 'pageInfo' in v) {
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
      paths
    }
  }, {
    value,
    paths: []
  });
}