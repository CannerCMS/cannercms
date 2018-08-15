// @flow

import isFunction from 'lodash/isFunction';

export default class VisitorHandler {
  visitor: Visitor;
  constructor(visitor: InputVisitor) {
    this.visitor = {};
    if (visitor) {
      this.merge(visitor);
    }
  }

  getVisitor() {
    return this.visitor;
  }

  merge(visitor: InputVisitor) {
    Object.keys(visitor).forEach((nodeType) => {
      // visitorFuncs has enter and exit function
      let visitorFuncs: any = visitor[nodeType];
      // handle enter function shorthand
      if (isFunction(visitorFuncs)) {
        visitorFuncs = ({
          enter: visitorFuncs,
        }: VisitorObj);
      }
      // has visitor aleady
      if (nodeType in this.visitor) {
        this.appendVisitor(nodeType, visitorFuncs);
      } else {
        this.createVisitor(nodeType, visitorFuncs);
      }
    });
  }

  appendVisitor(nodeType: string, visitorFuncs: VisitorObj) {
    if (visitorFuncs.enter) {
      this.visitor[nodeType].enter.push(visitorFuncs.enter);
    }
    if (visitorFuncs.exit) {
      this.visitor[nodeType].exit.push(visitorFuncs.exit);
    }
  }

  createVisitor(nodeType: string, visitorFuncs: VisitorObj) {
    const that = this;
    that.visitor[nodeType] = {
      enter: visitorFuncs.enter ? [visitorFuncs.enter] : [],
      exit: visitorFuncs.exit ? [visitorFuncs.exit] : [],
    };
  }
}
