/**
 * @flow
 */

import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import {chain} from 'lodash';
import Pattern from './pattern';

function getValueID(action: MutateAction) {
  return get(action, 'payload.id');
}

export default class CollectionPattern extends Pattern {
  // CollectionPattern 要注意的地方是
  // 在合併或刪除 action 的時候要將 id 考慮進去

  removeUpdateBeforeDelete() {
    // 如果更改後又刪除，就可以只保留刪除
    const actions = this.actions;

    // 先找到刪除 actions 的 ids
    const deleteIds = actions
      .filter(action => action.type === 'DELETE_ARRAY_ITEM')
      .map(action => getValueID(action));
    // 遍歷actions 如果 CollectionUpdate 的 id 在 deleteIds 之中
    // 就應該被移除
    this.actions = this.actions
        .filter(action => !(action.type === 'UPDATE_ARRAY' &&
          deleteIds.indexOf(getValueID(action)) !== -1));
  }

  removeCreateBeforeDelete() {
    // 如果新增後又刪除，該 id 的所有 action 都應該被移除
    const actions = this.actions;
    let idGroup = {
      CollectionCreate: [],
      CollectionDelete: []
    };
    // generate idGroup
    // idGroup: {
    //   CollectionCreate: ['id1', 'id2'],
    //   CollectionDelete: ['id1', 'id3'],
    // }
    actions.forEach(action => {
      const {type} = action;
      const id = getValueID(action);
      if (type === 'CREATE_ARRAY_ITEM') {
        idGroup.CollectionCreate.push(id);
      } else if (type === 'DELETE_ARRAY_ITEM') {
        idGroup.CollectionDelete.push(id);
      }
    });

    // 如果有 action 的 id 同時在 CollectionCreate 以及 CollectionDelete
    // 全部移除
    this.actions = actions.filter(action => {
      const actionId = getValueID(action);
      return !(idGroup.CollectionCreate.indexOf(actionId) !== -1 &&
        idGroup.CollectionDelete.indexOf(actionId) !== -1);
    });
  }

  mergeMultiCollectionUpdate() {
    // 利用相同 id 的 action
    // 建構出修改的資料
    // ---------------
    // 找出所有 updateActions, 並記錄他們的 index
    // generateActions
    // updateActions = [{action, index: 0}, {action, index,4}]
    const updateActions = this.actions.map(function(action, i) {
      if (action.type === 'UPDATE_ARRAY') {
        return {action, index: i};
      }
      return undefined;
    }).filter(actionWithIndex => !isUndefined(actionWithIndex));

    // 利用 id 分類
    // merge 修改的資料
    // {
    //   id1: {
    //     info: {
    //       name: 'test'
    //     }
    //   },
    //   id2: {
    //     habit: 'test'
    //   }
    // }
    // 利用 id 分類
    // 找到每個 id 裡最後的那個 updateAction index
    // [id1, id2]
    const indexShouldBePreserved = chain(updateActions)
      .groupBy(val => getValueID(val.action))
      .mapValues(val => val[val.length - 1].index)
      .values()
      .value();

    // 如果是 updateAction 且不在 indexShouldBePreserved 裡
    // 就刪除
    this.actions = this.actions.filter(function(action, i) {
      return action.type !== 'UPDATE_ARRAY' ||
        indexShouldBePreserved.indexOf(i) !== -1;
    });
  }

  mergeUpdateAfterCreate() {
    // 新增後更新
    // 可以只保留新增即可
    // 要將 updated data merge 到新增的資料

    // 利用 createAction 的 id 當 key，
    // 該 id 的 createAction or updateAction Array 當 value
    // {
    //   createActionId: lastUpdateAction | createAction
    // }
    let createActionGroup = {};
    this.actions.forEach(action => {
      const {type} = action;
      const id = getValueID(action);
      if (type === 'CREATE_ARRAY_ITEM' ||
        (type === 'UPDATE_ARRAY' && id in createActionGroup)) {
        createActionGroup[id] = action;
      }
    });
    // 1. 刪除所有 createAction 之後的 updateAction
    // 2. 更新 createAction 的資料
    this.actions = this.actions
      .filter(action => {
        return !(action.type === 'UPDATE_ARRAY' &&
          getValueID(action) in createActionGroup);
      })
      .map(action => {
        if (action.type === 'CREATE_ARRAY_ITEM') {
          const lastAction = createActionGroup[getValueID(action)];
          if (lastAction.type === 'UPDATE_ARRAY') {
            action.payload.value = lastAction.payload.value;
          }
        }
        return action;
      });
  }

  mergeAction() {
    this.removeCreateBeforeDelete();
    // console.log(this.actions);
    this.removeUpdateBeforeDelete();
    // console.log(this.actions);
    this.mergeMultiCollectionUpdate();
    // console.log(this.actions);
    this.mergeUpdateAfterCreate();
    // console.log(this.actions);
    return this.actions;
  }
}
