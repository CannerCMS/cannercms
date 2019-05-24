// @flow

import BasicModel from './basic';
import type { CannerSchema } from '../flow-types';

type attrsTypes = CannerSchema & {
  values: Array<string>
};

export default class EnumModel extends BasicModel {
  constructor(attrs: attrsTypes) {
    super('enum', attrs);
    if (!attrs.values) {
      throw new Error('The "values" of <enum /> is required');
    }
  }

  getDefaultUI() {
    return 'select';
  }
}
