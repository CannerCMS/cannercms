// @flow
import rule from './rules';
import get from 'lodash/get';
import Ajv from 'ajv';

export default class Validator {
  ajv: Ajv;
  throwError = true;
  schema = {};
  rule = {};
  isRoot = false;

  constructor(schema: Object, options: Object = {}) {
    const {rule, isRoot} = options;
    this.schema = schema;
    this.isRoot = isRoot;
    this.rule = rule || this.getRule() || {type: 'object'};
    this.ajv = new Ajv();
  }

  validate = () => {
    return this.ajv.validate(this.rule, this.schema);
  }

  getErrorText = () => {
    return this.ajv.errorsText();
  }

  getRule = () => {
    const {type, ui} = this.schema;
    if (this.isRoot) {
      return get(rule, 'root', undefined);
    }
    return get(rule, [type, ui || 'default'], undefined);
  }
}