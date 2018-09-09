// @flow

import BasicModel from './basic';
import type {CannerSchema} from '../flow-types';

export default class JsonModal extends BasicModel {
  constructor(attrs: CannerSchema) {
    super('json', attrs);
  }

}
