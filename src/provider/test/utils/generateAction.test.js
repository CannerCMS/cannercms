import generateAction from '../../src/utils/generateAction';
import {fromJS} from 'immutable';
import {UNIQUE_ID} from '../../src/config';
import objectId from 'bson-objectid';

describe('generateAction', () => {
  it('posts/0 create', () => {
    const collection = fromJS([]);
    const action = generateAction('posts/0', 'create', fromJS({name: 123}), collection);
    expect(action.type).toBe('CREATE_ARRAY_ITEM');
    expect(action.payload.id).toBeDefined();
    expect(action.payload.key).toBe('posts');
    expect(action.payload.path).toBe('');
    expect(action.payload.value.toJS()).toEqual(expect.objectContaining({[UNIQUE_ID]: expect.any(String), name: 123}));
  });

  it('posts/0/category/0 create', () => {
    const id = objectId().toString();
    const collection = fromJS([{
      [UNIQUE_ID]: id,
      category: [],
    }]);
    const action = generateAction('posts/0/category/0', 'create', fromJS({name: 123}), collection);
    expect(action.type).toBe('CREATE_ARRAY_NESTED_ITEM');
    expect(action.payload.id).toBeDefined();
    expect(action.payload.key).toBe('posts');
    expect(action.payload.path).toBe('category/0');
    expect(action.payload.value.toJS()).toEqual(expect.objectContaining({name: 123}));
  });

  it('info/category/0 create', () => {
    const id = objectId().toString();
    const map = fromJS({
      [UNIQUE_ID]: id,
      category: [],
    });
    const action = generateAction('info/category/0', 'create', fromJS({name: 123}), map);
    expect(action.type).toBe('CREATE_OBJECT_NESTED_ITEM');
    expect(action.payload.key).toBe('info');
    expect(action.payload.path).toBe('category/0');
    expect(action.payload.value.toJS()).toEqual(expect.objectContaining({name: 123}));
  });

  it('posts/0/name update', () => {
    const id = objectId().toString();
    const collection = fromJS([{
      [UNIQUE_ID]: id,
      name: 123,
    }]);
    const action = generateAction('posts/0/name', 'update', 321, collection);
    expect(action.type).toBe('UPDATE_ARRAY');
    expect(action.payload.id).toBe(id);
    expect(action.payload.key).toBe('posts');
    expect(action.payload.path).toBe('name');
    expect(action.payload.value).toBe(321);
  });

  it('info/name update', () => {
    const map = fromJS({
      name: 123,
    });
    const action = generateAction('info/name', 'update', 321, map);
    expect(action.type).toBe('UPDATE_OBJECT');
    expect(action.payload.key).toBe('info');
    expect(action.payload.path).toBe('name');
    expect(action.payload.value).toBe(321);
  });

  it('posts/1 delete', () => {
    const id = objectId().toString();
    const id2 = objectId().toString();
    const collection = fromJS([{
      [UNIQUE_ID]: id,
      name: 123,
    }, {
      [UNIQUE_ID]: id2,
      name: 321,
    }]);
    const action = generateAction('posts/1', 'delete', undefined, collection);
    expect(action.type).toBe('DELETE_ARRAY_ITEM');
    expect(action.payload.id).toBe(id2);
    expect(action.payload.key).toBe('posts');
    expect(action.payload.path).toBe('');
    expect(action.payload.value).not.toBeDefined();
  });

  it('posts/0/category/0 delete', () => {
    const id = objectId().toString();
    const collection = fromJS([{
      [UNIQUE_ID]: id,
      category: [123],
    }]);
    const action = generateAction('posts/0/category/0', 'delete', undefined, collection);
    expect(action.type).toBe('DELETE_ARRAY_NESTED_ITEM');
    expect(action.payload.id).toBe(id);
    expect(action.payload.key).toBe('posts');
    expect(action.payload.path).toBe('category/0');
    expect(action.payload.value).not.toBeDefined();
  });

  it('info/category/0 delete', () => {
    const map = fromJS({
      category: [123],
    });
    const action = generateAction('info/category/0', 'delete', undefined, map);
    expect(action.type).toBe('DELETE_OBJECT_NESTED_ITEM');
    expect(action.payload.key).toBe('info');
    expect(action.payload.path).toBe('category/0');
    expect(action.payload.value).not.toBeDefined();
  });

  it('posts/0/category/0 swap', () => {
    const id = objectId().toString();
    const collection = fromJS([{
      [UNIQUE_ID]: id,
      category: [123, 321],
    }]);
    const action = generateAction({firstId: 'posts/0/category/0', secondId: 'posts/0/category/1'}, 'swap', undefined, collection);
    expect(action.payload.id).toBe(id);
    expect(action.payload.key).toBe('posts');
    expect(action.payload.path).toEqual(['category/0', 'category/1']);
  });

  it('info/category/0 swap', () => {
    const map = fromJS({
      category: [123, 321],
    });
    const action = generateAction({firstId: 'info/category/0', secondId: 'info/category/1'}, 'swap', undefined, map);
    expect(action.payload.key).toBe('info');
    expect(action.payload.path).toEqual(['category/0', 'category/1']);
  });
});
