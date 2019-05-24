// @flow

import saferEval from 'safer-eval';
import { flatten } from 'lodash';
import type { CannerSchema } from '../flow-types';
import BasicModel from './basic';

export default class ArrayModel extends BasicModel {
  // https://github.com/babel/babel/issues/8417
  /* :: attributes: Object; */
  /* :: keyName: string = ''; */
  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    super('array', attrs);
    let { builder } = this.attributes;
    if (typeof builder === 'string') {
      builder = saferEval(builder);
    }

    if (typeof builder === 'function') {
      this.toJson = () => builder({ attributes: { ...attrs, builder: undefined }, children });
      return this;
    }

    if (children && children.length) {
      const flattenChilden = flatten((children: Array<any>));
      const toolbar = flattenChilden.find(item => item.__TOOLBAR__);
      if (toolbar) {
        this.attributes.toolbar = toolbar;
      }
      const otherChildren = flattenChilden.filter(item => !item.__TOOLBAR__);

      if (otherChildren.length === 1) {
        const child = otherChildren[0];
        if (child.keyName) {
          this.attributes.items = {
            type: 'object',
            items: {
              [child.keyName]: child,
            },
          };
        } else {
          this.attributes.items = child;
        }
      } else {
        this.attributes.items = {
          type: 'object',
          items: flattenChilden.reduce((result, child) => {
            if (child.keyName in result) {
              throw new Error(`duplicated name in children of ${this.keyName}`);
            }

            if (child.__TOOLBAR__) {
              return result;
            }
            result[child.keyName] = child;
            return result;
          }, {}),
        };
      }
    }
  }

  getDefaultUI() {
    return 'table';
  }
}
