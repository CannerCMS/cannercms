// @flow

import BasicModel from './basic';
import {getRandomKey} from '../layout';
import type {CannerSchema} from '../flow-types';

export default class ChartModel extends BasicModel {
  constructor({keyName = getRandomKey() , ...attrs}: CannerSchema, children: Array<CannerSchema>) {
    super('chart', {
      keyName,
      ...attrs
    });

    this.withToolBar(children);
  }

  getDefaultUI() {
    return 'line';
  }
}
