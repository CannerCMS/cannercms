// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import Ajv from 'ajv';
import {isEmpty, isArray, isPlainObject, isFunction, get} from 'lodash';
import type {HOCProps} from './types';

type State = {
  error: boolean,
  errorInfo: Array<any>
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

    validate = (result: any) => {
      const {refId, validation = {}, required = false} = this.props;
      // required
      const paths = refId.getPathArr().slice(1);
      const {value} = getValueAndPaths(result.data, paths);
      const isRequiredValid = required ? Boolean(value) : true;

      const {schema, validator, errorMessage} = validation;
      let validate = null

      // Ajv validation
      if(schema && !isEmpty(schema)) {
        const ajv = new Ajv();
        validate = ajv.compile(schema);
      }
      // custom validator
      const reject = message => ({error: true, message});
      const validatorResult = (validator && isFunction(validator) ) && validator(value, reject);
  
      let customValid = !(validatorResult && validatorResult.error);

      // if value is empty, should not validate with ajv
      if (customValid && isRequiredValid && (!(value && isFunction(validate)) || validate(value))) {
        this.setState({
          error: false,
          errorInfo: []
        });
        return result;
      }
      
  
      const errorInfo = []
        .concat(isRequiredValid ? [] : {
          message: 'should be required'
        })
        .concat(validate.errors ? (errorMessage ? {message: errorMessage} : validate.errors) : [])
        .concat(customValid ? [] : validatorResult);

      this.setState({
        error: true,
        errorInfo: errorInfo
      });
      return {
        ...result,
        error: true,
        errorInfo: errorInfo
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