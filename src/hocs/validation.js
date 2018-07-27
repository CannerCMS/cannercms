// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import {Map, List} from 'immutable';
import Ajv from 'ajv';
import {isEmpty} from 'lodash';
import type {HOCProps} from './types';

type State = {
  error: boolean,
  errorInfo: Array<any>
}

export default function withValidation(Com: React.ComponentType<*>) {
  return class ComponentWithValition extends React.Component<HOCProps, State> {
    key: string;
    id: ?string;
    state = {
      error: false,
      errorInfo: []
    }

    componentDidMount() {
      const {refId, validation = {}, onDeploy, required = false} = this.props;
      const key = refId.getPathArr()[0];
      const ajv = new Ajv();
      const validate = ajv.compile(validation);
      if (isEmpty(validation) && !required) {
        // no validation
        return;
      }
      let paths = refId.getPathArr();
      const {validator = {validate: (value?: any) => value || true, message: ''}} = validation;
      paths = paths.slice(1);
      onDeploy(key, result => {
        const {value} = getValueAndPaths(result.data, paths);
        const isRequiredValid = required ? Boolean(value) : true;
        const customValid = validator.validate(value);
        if (customValid && isRequiredValid && validate((value && value.toJS) ? value.toJS() : value)) {
          this.setState({
            error: false,
            errorInfo: []
          });
          return result;
        }
        const errorInfo = [].concat(isRequiredValid ? []:{message: 'required'})
          .concat(validate.errors || [])
          .concat(customValid ? []:{message: validator.message});
        this.setState({
          error: true,
          errorInfo: errorInfo
        });
        return {
          ...result,
          error: true,
          errorInfo: errorInfo
        }
      });
    }

    render() {
      const {error, errorInfo} = this.state;
      return <React.Fragment>
        <Com {...this.props}/>
        {
          error && <span style={{color: 'red'}}>{errorInfo[0].message}</span>
        }
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
    id = rootValue.getIn([key, index, 'id']);
  }
  return {
    key,
    id
  }
}

export function getValueAndPaths(value: Map<string, *>, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    let v = result.value;
    let paths = result.paths;
    if (Map.isMap(v)) {
      if (v.has('edges') && v.has('pageInfo')) {
        v = v.getIn(['edges', key, 'node']);
        paths = paths.concat(['edges', key, 'node']);
      } else {
        v = v.get(key);
        paths = paths.concat(key);
      }
    } else if (List.isList(v)) {
      v = v.get(key);
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