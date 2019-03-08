// @flow
import {generateAction} from '../action';
import {update, merge, isPlainObject} from 'lodash';
import {createEmptyData} from 'canner-helpers';

export function createAction({
  relation,
  id,
  type,
  value,
  config,
  rootValue,
  items,
  transformGqlPayload
}: { 
  relation: any,
  id: {firstId: string, secondId: string} | string,
  type: 'create' | 'update' | 'delete' | 'swap',
  value: any,
  config: any,
  rootValue: any,
  value: any,
  items: any,
  transformGqlPayload?: Function
}) {
  if (type === 'create') {
    if (!config) {
      const emptyData = createEmptyData(items);
      if (isPlainObject(emptyData)) {
        value = merge(emptyData, value);
      } else {
        value = emptyData;
      }
    }
    if (typeof id === 'string' && id.split('/').length === 1) {
      update(value, 'id', id => id || randomId());
    }
  }
  return generateAction({
    id,
    updateType: type,
    value,
    rootValue,
    relation,
    transformGqlPayload
  });
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}
