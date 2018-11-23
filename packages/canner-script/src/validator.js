// @flow
import type {CannerSchema} from './flow-types';
import {componentMap} from './utils';

const TYPES = ['string', 'number', 'boolean', 'array', 'object', 'relation', 'json', 'component'];
const CANNER_DATA_TYPES = Object.keys(componentMap._map);

type ValidatorConfig = {
  throwError: boolean;
}

class Validator {
  throwError = true;
  setConfig = (config: ValidatorConfig) => {
    if ('throwError' in config) {
      this.throwError = config.throwError;
    }
  }

  validatePackageName = (packageName: string) => {
    const type = this.parseType(packageName);
    if (TYPES.indexOf(type) === -1) {
      const message = `Invalid package name '${packageName}', type should be one of ${JSON.stringify(TYPES)}`;
      return this.invalid(message);
    }
    return true;
  }

  validateCannerDataType = (cannerDataType: string) => {
    if (CANNER_DATA_TYPES.indexOf(cannerDataType) === -1) {
      const message = `Invalid canner data type '${cannerDataType}, should be one of ${JSON.stringify(CANNER_DATA_TYPES)}'`;
      return this.invalid(message);
    }
    return true;
  }

  validate = (json: {type: string, packageName: string} & CannerSchema) => {
    const {packageName, type} = json;
    if (type === 'component') {
      return true;
    }

    if (packageName === '@canner/antd-object-fieldset') {
      return true;
    }
    
    return this.validatePackageName(packageName) && this.validateCannerDataType(type);
  }

  invalid = (message: string = '') => {
    if (this.throwError) {
      throw new Error(message);
    } else {
      // eslint-disable-next-line
      console.error(message);
      return false;
    }
  }

  parseType = (packageName: string) => {
    return packageName.replace(/\\/g, '/').split('/').slice(-1)[0].split('-')[1];
  }
}

export default new Validator()
