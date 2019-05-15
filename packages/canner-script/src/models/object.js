// @flow

import type {CannerSchema} from '../flow-types';
import BasicModel from './basic';
import saferEval from 'safer-eval';
import {flatten} from 'lodash';

export default class ObjectModel extends BasicModel {
  // https://github.com/babel/babel/issues/8417
  /*:: attributes: Object; */

  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    super('object', attrs);
    let {builder} = this.attributes;
    if (typeof builder === 'string') {
      builder = saferEval(builder);
    }
    
    if (typeof builder === 'function') {
      this.toJson = () => builder({attributes: {...attrs, builder: undefined}, children});
      return this;
    }
    
    if (children && children.length) {
      const flattenChildren = flatten((children: Array<any>));
      this.attributes.items = flattenChildren.reduce((result, child) => {
        if (child.keyName in result) {
          throw new Error(`duplicated keyName in children of ${this.attributes.keyName}`);
        }
        result[child.keyName] = child;
        return result;
      }, {});
    }
  }

  getDefaultUI() {
    return 'fieldset';
  }
}