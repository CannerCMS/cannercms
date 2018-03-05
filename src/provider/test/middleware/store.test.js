import Rx from 'rxjs/Rx';
import Store from '../../src/middleware/store';
import Entity from '../../src/middleware/store/entity';
import Resource from '../../src/middleware/store/resource';
import Filter from '../../src/middleware/store/filter';

import {fromJS, Map, List} from 'immutable';
import {UNIQUE_ID} from '../../src/config';

const defaultValue = {[UNIQUE_ID]: '0', name: 123, category: []};

describe('entities', () => {
  let entity = new Entity();
  it('create', () => {
    // create
    entity.createCollection('entityID1', new List());
    expect(entity.store.entityID1.ids.size).toBe(0);
    entity.createMap('entityID2');
    expect(entity.store.entityID2).toEqual({});
  });

  it('get', () => {
    expect(entity.get('entityID1').ids.size).toBe(entity.store.entityID1.ids.size);
    expect(entity.get('entityID2')).toEqual(entity.store.entityID2);
  });

  it('update', () => {
    entity.updateCollection('entityID1', Entity.ids, fromJS(['valueId1']));
    expect(entity.store.entityID1.ids.size).toBe(1);
    const sort = () => new List();
    entity.updateCollection('entityID1', Entity.sort, sort);
    expect(entity.store.entityID1.sort).toBe(sort);
  });

  it('replace', () => {
    const entities = ['entityID1'];
    const re = {
      path: 'anything i do not care',
      data: {
        from: 'valueId1',
        to: 'valueId2',
      },
    };
    entity.replace(re, entities);
    expect(entity.store.entityID1.ids.toJS()).toEqual(['valueId2']);
  });

  it('delete', () => {
    entity.delete('entityID1');
    expect(entity.store.entityID1).not.toBeDefined();
  });
});

describe('resource', () => {
  let resource = new Resource();
  it('create', () => {
    // create
    resource.create('valueID1', fromJS([{
      [UNIQUE_ID]: 'valueID',
      name: '123',
    }]));
    expect(resource.value.valueID1.toJS().valueID.name).toBe('123');
    resource.create('valueID2', new Map({
      name: '321',
    }));
    expect(resource.value.valueID2.toJS().name).toBe('321');
  });

  it('get', () => {
    expect(resource.getList('valueID1', new List(['valueID'])).size).toBe(1);
    expect(resource.get('valueID1').toJS()).toEqual({
      valueID: {
        [UNIQUE_ID]: 'valueID',
        name: '123',
      },
    });
    expect(resource.get('valueID2').toJS()).toEqual({
      name: '321',
    });
  });

  it('update', () => {
    resource.set('valueID2', new Map({
      name: 'new',
    }));
    expect(resource.value.valueID2.toJS()).toEqual({name: 'new'});
    resource.merge('valueID2', new Map({
      name1: 'new1',
    }));
    expect(resource.value.valueID2.toJS()).toEqual({
      name: 'new',
      name1: 'new1',
    });
  });

  it('replace', () => {
    resource.merge('valueID2', fromJS({
      name1: 'new1',
      category: ['id1', 'id2'],
    }));
    let re = {
      path: `valueID1/${UNIQUE_ID}`,
      data: {
        from: 'valueID',
        to: 'valueIDD',
      },
    };
    resource.replace(re, true);
    expect(resource.value.valueID1.getIn(['valueIDD', UNIQUE_ID])).toBe('valueIDD');
    re = {
      path: `valueID2/category`,
      data: {
        from: 'id1',
        to: 'newid',
      },
    };
    resource.replace(re, false);
    expect(resource.value.valueID2.getIn(['category', 0])).toBe('newid');
  });

  it('delete', () => {
    resource.delete('valueID1');
    expect(resource.value.valueID1).not.toBeDefined();
  });
});

describe('store', () => {
  let store;
  beforeEach(() => {
    store = new Store();
    store.create('info', 'info', fromJS(defaultValue));
    store.create('posts', 'posts1', fromJS([defaultValue]));
    store.create('posts', 'posts2', fromJS([defaultValue]));
  });
  it('update Store', () => {
    expect(store.resource.get('info').toJS()).toEqual(defaultValue);
    expect(store.entity.get('info')).toBeDefined();
    expect(store.entity.get('posts1').ids.toJS()).toEqual(['0']);
    expect(store.resource.get('posts').toJS()).toEqual({[defaultValue[UNIQUE_ID]]: defaultValue});
  });

  it('subscribe subject', () => {
    store.subscribe('info', 'info', 'value', (value) => {
      console.log(value);
    });
    store.subscribe('posts', 'posts1', 'childAdded', (value) => {
      console.log(value);
    });
    store.subscribe('posts', 'posts1', 'childRemoved', (value) => {
      console.log(value);
    });
    store.subscribe('posts', 'posts1', 'childChanged', (value) => {
      console.log(value);
    });
    expect(store.entity.getSubject('info', 'value')).toBeInstanceOf(Rx.Subject);
    expect(store.entity.getSubject('posts1', 'childAdded')).toBeInstanceOf(Rx.Subject);
    expect(store.entity.getSubject('posts1', 'childRemoved')).toBeInstanceOf(Rx.Subject);
    expect(store.entity.getSubject('posts1', 'childChanged')).toBeInstanceOf(Rx.Subject);
  });

  it('subject push', () => {
    store.subscribe('info', 'info', 'value', (value) => {
      expect(value.toJS()).toEqual({name: 321});
    });
    store.subscribe('posts', 'posts1', 'value', (value) => {
      expect(value.toJS()).toEqual({[UNIQUE_ID]: 1, name: 321});
    });
    store.subscribe('posts', 'posts1', 'value', (value) => {
      expect(value.toJS()).toEqual({[UNIQUE_ID]: 0, name: 321});
    });
    store.subscribe('posts', 'posts1', 'value', (value) => {
      expect(value.toJS()).toEqual({[UNIQUE_ID]: 0, name: 321});
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      console.log(value);
      // expect(value.toJS()).toEqual({[UNIQUE_ID]: 0, name: 321});
    });
    store.pushSubject('info', 'value', fromJS({name: 321}));
    store.pushSubject('posts1', 'childAdded', fromJS({[UNIQUE_ID]: 1, name: 321}));
    store.pushSubject('posts1', 'childChanged', fromJS({[UNIQUE_ID]: 0, name: 321}));
    store.pushSubject('posts1', 'childRemoved', fromJS({[UNIQUE_ID]: 0, name: 321}));
  });
});

describe('store mutate', () => {
  let store;
  beforeEach(() => {
    store = new Store();
    store.create('info', 'info', fromJS(defaultValue));
    store.create('posts', 'posts1', fromJS([defaultValue]));
    store.create('posts', 'posts2', fromJS([defaultValue]));
  });
  it('CREATE_ARRAY_ITEM', () => {
    const action = {
      type: 'CREATE_ARRAY_ITEM',
      payload: {
        key: 'posts',
        id: '2',
        value: fromJS({
          [UNIQUE_ID]: '2',
          name: 345,
        }),
      },
    };
    // store.subscribe('posts', 'posts1', 'childAdded', value => {
    //   expect(value.toJS()).toEqual({
    //     [UNIQUE_ID]: '2',
    //     name: 345
    //   });
    // });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts1').ids).toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(store.resource.getList('posts').get(1).toJS()).toEqual(action.payload.value.toJS());
    expect(mutatedValue.toJS()).toEqual(action.payload.value.toJS());
  });

  it('CREATE_ARRAY_NESTED_ITEM', () => {
    const action = {
      type: 'CREATE_ARRAY_NESTED_ITEM',
      payload: {
        key: 'posts',
        id: '0',
        path: 'category',
        value: fromJS({
          name: 123,
        }),
      },
    };
    const changedFunc = jest.fn();
    const valueFunc = jest.fn();
    store.subscribe('posts', 'posts1', 'childChanged', (value) => {
      changedFunc();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts1').ids).get(0).toJS());
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      valueFunc();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts2').ids).toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(changedFunc).toHaveBeenCalledTimes(1);
    expect(valueFunc).toHaveBeenCalledTimes(1);
    expect(store.resource.getList('posts').getIn([0, 'category', 0]).toJS()).toEqual({
      name: 123,
    });
    expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('CREATE_OBJECT_NESTED_ITEM', () => {
    const action = {
      type: 'CREATE_OBJECT_NESTED_ITEM',
      payload: {
        key: 'info',
        path: 'category',
        value: fromJS({
          name: 123,
        }),
      },
    };
    const fn = jest.fn();
    store.subscribe('info', 'info', 'value', (value) => {
      fn();
      expect(value.toJS()).toEqual(store.resource.get('info').toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(store.resource.get('info').getIn(['category', 0]).toJS()).toEqual(action.payload.value.toJS());
    expect(mutatedValue.toJS()).toEqual(store.resource.get('info').toJS());
  });

  it('UPDATE_ARRAY - item prop', () => {
    const action = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: '0',
        path: 'name',
        value: 321,
      },
    };
    const changed = jest.fn();
    const valued = jest.fn();
    store.subscribe('posts', 'posts1', 'childChanged', (value) => {
      changed();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts1').ids).get(0).toJS());
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      valued();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts2').ids).toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(valued).toHaveBeenCalledTimes(1);
    expect(store.resource.getList('posts').getIn([0, 'name'])).toBe(action.payload.value);
    expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('UPDATE_ARRAY - item', () => {
    const action = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: '0',
        value: fromJS({[UNIQUE_ID]: '0', name: 321}),
      },
    };
    const changed = jest.fn();
    const valued = jest.fn();
    store.subscribe('posts', 'posts1', 'childChanged', (value) => {
      changed();
      expect(value.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      valued();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts2').ids).toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(valued).toHaveBeenCalledTimes(1);
    expect(store.resource.getList('posts').getIn([0, 'name'])).toBe(321);
    expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('UPDATE_ARRAY - nested item', () => {
    const action = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: '0',
        path: 'category/0',
        value: fromJS({name: 321}),
      },
    };
    const changed = jest.fn();
    const valued = jest.fn();
    store.subscribe('posts', 'posts1', 'childChanged', (value) => {
      changed();
      expect(value.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      valued();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts2').ids).toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(valued).toHaveBeenCalledTimes(1);
    expect(store.resource.getList('posts').getIn([0, 'category', 0, 'name'])).toBe(321);
    expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('UPDATE_ARRAY - nested item prop', () => {
    const action = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: '0',
        path: 'category/0/name',
        value: 321,
      },
    };
    const changed = jest.fn();
    const valued = jest.fn();
    store.subscribe('posts', 'posts1', 'childChanged', (value) => {
      changed();
      expect(value.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      valued();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts2').ids).toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(valued).toHaveBeenCalledTimes(1);
    expect(store.resource.getList('posts').getIn([0, 'category', 0, 'name'])).toBe(321);
    expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('UPDATE_OBJECT', () => {
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'info',
        path: 'name',
        value: 345,
      },
    };
    store.subscribe('info', 'info', 'value', (value) => {
      expect(value.toJS()).toEqual(store.resource.get('info').toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(store.resource.get('info').get('name')).toBe(action.payload.value);
    expect(mutatedValue.toJS()).toEqual(store.resource.get('info').toJS());
  });

  it('DELETE_ARRAY_ITEM', () => {
    const action = {
      type: 'DELETE_ARRAY_ITEM',
      payload: {
        key: 'posts',
        id: '0',
      },
    };
    const removed = jest.fn();
    const valued = jest.fn();
    store.subscribe('posts', 'posts1', 'childRemoved', (value) => {
      removed();
      expect(value.toJS()).toEqual(defaultValue);
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      valued();
      expect(value.toJS()).toEqual(store.resource.getList('posts', store.entity.get('posts2').ids).toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(removed).toHaveBeenCalledTimes(1);
    expect(valued).toHaveBeenCalledTimes(1);
    expect(store.resource.getList('posts').size).toBe(0);
    expect(mutatedValue).toEqual(null);
  });

  it('DELETE_ARRAY_NESTED_ITEM', () => {
    const action = {
      type: 'DELETE_ARRAY_NESTED_ITEM',
      payload: {
        key: 'posts',
        id: '0',
        path: 'category/0',
      },
    };
    const newValue = {...defaultValue, category: [
      {
        name: 123,
      },
      {
        name: 345,
      },
    ]};
    store.update('posts', 'posts1', fromJS([newValue]));
    store.subscribe('posts', 'posts1', 'childChanged', (value) => {
      expect(value.toJS()).toEqual(store.resource.getList('posts').get('0').toJS());
    });
    store.subscribe('posts', 'posts1', 'value', (value) => {
      expect(value.toJS()).toEqual(store.resource.getList('posts').toJS());
    });
    store.subscribe('posts', 'posts2', 'value', (value) => {
      expect(value.toJS()).toEqual(store.resource.getList('posts').toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(store.resource.getList('posts').getIn([0, 'category', 0, 'name'])).toBe(345);
    expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('DELETE_OBJECT_NESTED_ITEM', () => {
    const action = {
      type: 'DELETE_OBJECT_NESTED_ITEM',
      payload: {
        key: 'info',
        path: 'category/0',
      },
    };
    const newValue = {...defaultValue, category: [
      {
        name: 123,
      },
      {
        name: 345,
      },
    ]};
    store.update('info', 'info', fromJS(newValue));
    store.subscribe('info', 'info', 'value', (value) => {
      expect(value.toJS()).toEqual(store.resource.get('info').toJS());
    });
    const mutatedValue = store.mutate(action);
    expect(store.resource.get('info').getIn(['category', 0, 'name'])).toBe(345);
    expect(mutatedValue.toJS()).toEqual(store.resource.get('info').toJS());
  });

  it('SWAP_ARRAY_ITEM', () => {
    // for now, not support first layer swap
    // because first layer order can use sort query to implement

    // const action = {
    //   type: 'SWAP_ARRAY_ITEM',
    //   payload: {
    //     key: 'posts',
    //     id: '0',
    //     path: ['posts/0', 'posts/1']
    //   }
    // };
    // store.createSubject('posts', fromJS([{name: 123}, {name: 345}]));
    // const mutatedValue = store.mutate(action);
    // expect(store.resource.getList('posts').getIn([1, 'name'])).toBe(345);
    // expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('SWAP_ARRAY_NESTED_ITEM', () => {
    const action = {
      type: 'SWAP_ARRAY_NESTED_ITEM',
      payload: {
        key: 'posts',
        id: '0',
        path: ['category/0', 'category/1'],
      },
    };
    const newValue = {...defaultValue, category: [
      {
        name: 123,
      },
      {
        name: 345,
      },
    ]};
    store.update('posts', 'posts1', fromJS([newValue]));
    const mutatedValue = store.mutate(action);
    expect(store.resource.getList('posts').getIn([0, 'category', 0, 'name'])).toBe(345);
    expect(mutatedValue.toJS()).toEqual(store.resource.getList('posts').get(0).toJS());
  });

  it('SWAP_OBJECT_NESTED_ITEM', () => {
    const action = {
      type: 'SWAP_OBJECT_NESTED_ITEM',
      payload: {
        key: 'info',
        path: ['category/0', 'category/1'],
      },
    };
    const newValue = {...defaultValue, category: [
      {
        name: 123,
      },
      {
        name: 345,
      },
    ]};
    store.update('info', 'info', fromJS(newValue));
    const mutatedValue = store.mutate(action);
    expect(store.resource.get('info').getIn(['category', 0, 'name'])).toBe(345);
    expect(mutatedValue.toJS()).toEqual(store.resource.get('info').toJS());
  });
});
