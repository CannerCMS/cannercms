// @flow

import BasicModel from './basic';
import type {CannerSchema} from '../flow-types';

export default class FileModel extends BasicModel {
  attributes: Object;
  constructor(attrs: CannerSchema & {contentType: string}) {
    super('file', attrs);
  }

  getDefaultUI() {
    return 'file';
  }
}
