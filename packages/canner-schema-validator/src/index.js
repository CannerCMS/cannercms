// @flow
import rule from './rules';
import get from 'lodash/get';
import Ajv from 'ajv';
import {mapItems, enterSchema} from './utils';

export default class Validator {
  ajv: Ajv;
  throwError = true;
  schema = {};
  isRoot = false;
  defaultRule = {type: 'object'};

  constructor(schema: Object, options: Object = {}) {
    const {isRoot} = options;
    this.schema = schema;
    this.isRoot = isRoot;
    this.ajv = new Ajv();
  }

  validateSchema = (schema: Object, rule?: Object) => {
    return this.ajv.validate(rule || this.getRule(schema) || this.defaultRule, schema);
  }

  validate = () => {
    if (this.isRoot) {
      const rootRule = this.getRule(this.schema, this.isRoot);
      const rootResult = this.validateSchema(this.schema, rootRule);
      const schemaResults = mapItems(this.schema,  this.validateSchema);
      return rootResult && schemaResults
        .reduce((prev, curr) => prev && curr, true);
    } else {
      return enterSchema(this.schema, this.validateSchema)
        .reduce((prev, curr) => prev && curr, true);
    }
  }

  getErrorText = () => {
    return this.ajv.errorsText();
  }

  getRule = (schema?: Object, isRoot?: boolean) => {
    const {type, ui} = schema || this.schema;
    if (isRoot) {
      return get(rule, 'root', undefined);
    }
    return get(rule, [type, ui || 'default'], undefined);
  }
}