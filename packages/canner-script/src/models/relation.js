// @flow

import BasicModel from './basic';
import type { CannerSchema } from '../flow-types';

export default class RelationModel extends BasicModel {
  // https://github.com/babel/babel/issues/8417
  /* ::
  attributes: Object;
  */
  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    super('relation', attrs);
    if (children && children.length) {
      const toolbar = children.find(item => item.__TOOLBAR__);
      if (toolbar) {
        this.attributes.toolbar = toolbar;
      }
    } else {
      this.attributes.toolbar = {
        pagination: {},
      };
    }
  }

  getDefaultUI() {
    if ((this.attributes.relation || {}).type === 'toMany') {
      return 'multipleSelect';
    }
    return 'singleSelect';
  }
}
