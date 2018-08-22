// @flow

import BasicModel from './basic';
import {getRandomKey} from '../layout';
import type {CannerSchema} from '../flow-types';

export default class IndicatorModel extends BasicModel {
  constructor({keyName = getRandomKey() , ...attrs}: CannerSchema, children: Array<CannerSchema>) {
    super('indicator', {
      keyName,
      ...attrs
    });

    this.withToolBar(children);
  }

  getDefaultUI() {
    return 'amount';
  }
}
