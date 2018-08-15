// @flow

import BasicModel from './basic';
import type {CannerSchema} from '../flow-types';

export default class BooleanModel extends BasicModel {
  constructor(attrs: CannerSchema) {
    super('boolean', attrs);
  }

  getDefaultUI() {
    return 'switch';
  }
}
