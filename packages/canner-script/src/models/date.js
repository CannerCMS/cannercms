// @flow

import BasicModel from './basic';
import type { CannerSchema } from '../flow-types';

export default class DateModel extends BasicModel {
  constructor(attrs: CannerSchema) {
    super('dateTime', attrs);
  }

  getDefaultUI() {
    return 'dateTime';
  }
}
