// @flow

import type {CannerSchema} from '../flow-types';
import BasicModel from './basic';
import saferEval from 'safer-eval';

export default class ArrayModel extends BasicModel {
  attributes: Object;
  keyName: string;
  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    super('array', attrs);
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
      const toolbar = children.find(item => item.__TOOLBAR__);
      if (toolbar) {
        this.attributes.toolbar = toolbar;
      }
      const otherChildren = children.filter(item => !item.__TOOLBAR__);
      
      if (otherChildren.length === 1) {
        const child = otherChildren[0];
        if (child.keyName) {
          this.attributes.items = {
            type: 'object',
            items: {
              [child.keyName]: child
            }
          };
        } else {
          this.attributes.items = child;
        }
      } else {
        this.attributes.items = {
          type: 'object',
          items: children.reduce((result, child) => {
            if (child.keyName in result) {
              throw new Error(`duplicated name in children of ${this.keyName}`);
            }
  
            if (child.__TOOLBAR__) {
              return result;
            }
            result[child.keyName] = child;
            return result;
          }, {})
        };
      }
    }
  }

  getDefaultUI() {
    return 'table';
  }
}