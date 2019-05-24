// @flow

import BasicModel from './basic';
import type { CannerSchema } from '../flow-types';

export default class StringModel extends BasicModel {
  constructor(attrs: CannerSchema) {
    super('string', attrs);
  }

  getDefaultUI() {
    return 'input';
  }
}
