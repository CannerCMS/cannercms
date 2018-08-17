// @flow

import BasicModel from './basic';
import type {CannerSchema} from '../flow-types';

export default class GeoPointModel extends BasicModel {
  constructor(attrs: CannerSchema) {
    super('geoPoint', attrs);
  }
}
