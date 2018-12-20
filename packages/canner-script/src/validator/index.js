// @flow
import type {CannerSchema} from '../flow-types';
import rule from './rules';
import get from 'lodash/get';
import Ajv from 'ajv';

export default class Validator {
  ajv: Ajv;
  throwError = true;
  schema = {};
  rule = {};

  constructor(schema: CannerSchema, rule: Object) {
    this.schema = schema;
    this.rule = rule || getRule(schema) || {type: 'object'};
    this.ajv = new Ajv();
  }

  validate = () => {
    return this.ajv.validate(this.rule, this.schema);
  }

  getErrorText = () => {
    return this.ajv.errorsText();
  }
}

function getRule(schema: CannerSchema) {
  return get(rule, [schema.type, schema.ui || 'default'], undefined);
}