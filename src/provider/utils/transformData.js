// @flow

import * as Immutable from 'immutable';
import {isString, isBoolean, isNumber} from 'lodash';

const isTransform = function(data: mixed): boolean {
  return isString(data) ||
    isBoolean(data) ||
    isNumber(data) ||
    Immutable.Iterable.isIterable(data);
};

const transformData = function(data: mixed): mixed {
  if (isTransform(data)) {
    return data;
  }
  return Immutable.fromJS(data);
};

export {isTransform};
export default transformData;
