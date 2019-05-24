// @flow

import BasicModel from './basic';
import type { CannerSchema } from '../flow-types';

export default class NumberModel extends BasicModel {
  constructor(attrs: CannerSchema) {
    super('number', attrs);
  }

  getDefaultUI() {
    return 'input';
  }
}
