// @flow

import BasicModel from './basic';
import type {CannerSchema} from '../flow-types';
import saferEval from 'safer-eval';

export default class JsonModal extends BasicModel {
  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    super('json', attrs);

    let {builder} = this.attributes;
    
    if (typeof builder === 'string') {
      builder = saferEval(builder);
    }
    
    if (typeof builder === 'function') {
      // $FlowFixMe
      this.toJson = () => builder({attributes: {...attrs, builder: undefined}, children});
      return this;
    }
    
    if (children && children.length) {
      this.attributes.items = children.reduce((result, child) => {
        if (child.keyName in result) {
          throw new Error(`duplicated keyName in children of ${this.attributes.keyName}`);
        }
        result[child.keyName] = child;
        return result;
      }, {});
    }
  }

}
