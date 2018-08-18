// @flow

import BasicModel from './basic';
import type {CannerSchema} from '../flow-types';

export default class ChartModel extends BasicModel {
  constructor(attrs: CannerSchema) {
    super('chart', attrs);
  }

  getDefaultUI() {
    return 'line';
  }
}
