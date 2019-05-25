// @flow
/* eslint-disable no-param-reassign */

import saferEval from 'safer-eval';
import BasicModel from './basic';
import type { CannerSchema } from '../flow-types';

export default class JsonModal extends BasicModel {
  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    super('json', attrs);

    // $FlowFixMe
    let { builder } = this.attributes;

    if (typeof builder === 'string') {
      builder = saferEval(builder);
    }

    if (typeof builder === 'function') {
      this.toJson = () => builder({ attributes: { ...attrs, builder: undefined, type: 'json' }, children });
      return this;
    }

    if (children && children.length) {
    // $FlowFixMe
      this.attributes.items = children.reduce((result, child) => {
        if (child.keyName in result) {
          // $FlowFixMe
          throw new Error(`duplicated keyName in children of ${this.attributes.keyName}`);
        }
        result[child.keyName] = child;
        return result;
      }, {});
    }
  }
}
