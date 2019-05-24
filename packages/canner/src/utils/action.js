// @flow
import { update, merge, isPlainObject } from 'lodash';
import { createEmptyData } from 'canner-helpers';
import { generateAction } from '../action';

export function createAction({
  relation,
  id,
  type,
  value,
  config,
  rootValue,
  items,
  transformGqlPayload,
}: {
  relation: any,
  id: {firstId: string, secondId: string} | string,
  type: 'create' | 'update' | 'delete' | 'swap',
  value: any,
  config: any,
  rootValue: any,
  items: any,
  transformGqlPayload?: Function
}) {
  let newValue = null;
  if (type === 'create') {
    if (!config) {
      const emptyData = createEmptyData(items);
      if (isPlainObject(emptyData)) {
        newValue = merge(emptyData, value);
      } else {
        newValue = emptyData;
      }
    }
    if (typeof id === 'string' && id.split('/').length === 1) {
      update(value, 'id', id => id || randomId());
    }
  }
  return generateAction({
    id,
    updateType: type,
    value: newValue || value,
    rootValue,
    relation,
    transformGqlPayload,
  });
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}
