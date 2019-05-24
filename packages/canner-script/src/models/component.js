// @flow

import BasicModel from './basic';
import { getRandomKey } from '../layout';
import type { CannerSchema } from '../flow-types';

export default class ComponentModel extends BasicModel {
  constructor({ keyName = getRandomKey(), ...attrs }: CannerSchema, children: Array<CannerSchema>) {
    super('component', {
      keyName,
      ...attrs,
    });

    this.withToolBar(children);
  }
}
