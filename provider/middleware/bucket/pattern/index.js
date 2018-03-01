/**
 * @flow
 */

import MapPattern from './MapPattern';
import CollectionPattern from './CollectionPattern';
import type Pattern from './pattern';
export type {Pattern};

type action = CreateArrayItemAction |
  UpdateArrayAction |
  DeleteArrayItemAction |
  UpdateObjectAction

/**
 * create pattern according to the action name
 * @param  {string}  action       action
 * @return {Pattern} pattern
 */
export default function createPattern(action: action): Pattern {
  let pattern;
  // 目前只有 4 種有效 action type
  // CREATE_ARRAY
  // UPDATE_ARRAY_ITEM
  // DELETE_ARRAY_ITEM
  // UPDATE_OBJECT
  // 所以這裡只判斷 UPDATE_OBJECT
  // 其他都歸屬於 CollectionPattern
  const {key} = action.payload;
  if (action.type === 'UPDATE_OBJECT') {
    pattern = new MapPattern(key);
    pattern.addAction(action);
  } else {
    pattern = new CollectionPattern(key);
    pattern.addAction(action);
  }
  return pattern;
}
