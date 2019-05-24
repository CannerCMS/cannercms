// @flow

import BasicModel from './basic';
import type { CannerSchema } from '../flow-types';

export default class ImageModel extends BasicModel {
  // babel bug
  /* :: attributes: Object; */
  constructor(attrs: CannerSchema & {contentType: string}) {
    super('image', attrs);
  }

  getDefaultUI() {
    return 'image';
  }
}
