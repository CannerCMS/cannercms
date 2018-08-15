// @flow

import {default as V} from './visitors'; // default visitors

type Visitor = {
  [string]: Object
}

class VisitorManager {
  defaultVisitors = [...V];
  visitors = [];

  resetVisitors = () => {
    this.visitors.length = 0;
  }

  addVisitor = (visitor: Visitor) => {
    this.visitors.push(visitor);
  }

  setDefaultVisitors = (visitors: Array<*>) => {
    this.defaultVisitors = [...visitors];
  }

  getAllVisitors = () => {
    return [...this.visitors, ...this.defaultVisitors];
  }

}

export default new VisitorManager();
