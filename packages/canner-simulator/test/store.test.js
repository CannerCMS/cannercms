import RefId from 'canner-ref-id';
import store from '../src/store';

describe('store', () => {
  it('getValue', () => {
    expect(store.getValue().toJS()).toEqual({});
  });

  it('setValue', () => {
    const value = {
      info: {
        test: 123,
      },
    };
    store.setValue(value);
    expect(store.getValue().toJS()).toEqual(value);
  });

  it('getValueByPath', () => {
    const value = {
      info: {
        test: 123,
      },
    };
    store.setValue(value);
    expect(store.getValueByPath(new RefId('info')).toJS()).toEqual(value.info);
  });

  it('setValueByPath', () => {
    const value = {
      test: 123,
    };
    store.setValueByPath(new RefId('info'), value);
    expect(store.getValueByPath(new RefId('info')).toJS()).toEqual(value);
  });

  it('getValueByPath, complex', () => {
    const value = {
      posts: [{
        info: {
          name: 123,
        },
      }],
    };
    store.setValue(value);
    expect(store.getValueByPath(new RefId('posts/0/info/name'))).toBe(123);
  });
});


describe('handelOnChange', () => {
  beforeEach(() => {
    store.setValue({
      object: {
        object: {
          field: '123',
        },
        array: [{
          field: '123',
        }, {
          field: '321',
        }],
        field: '123',
      },
      array: [{
        _id: 'id0',
        object: {
          field: '123',
        },
        array: [{
          field: '123',
        }, {
          field: '321',
        }],
      }, {
        _id: 'id1',
        object: {
          field: '123',
        },
        array: [{
          field: '123',
        }, {
          field: '321',
        }],
      }],
    });
  });

  it('update object', () => {
    const path = new RefId('object');
    const value = {
      test: 123,
    };
    store.onChange(path, 'update', value);
    expect(store.getValueByPath(path).toJS()).toEqual(value);
  });

  it('update field in object', () => {
    const path = new RefId('object/object/field');
    const value = '321';
    store.onChange(path, 'update', value);
    expect(store.getValueByPath(path)).toBe(value);
  });

  it('update field in array', () => {
    const path = new RefId('array/0/object/field');
    const value = '321';
    store.onChange(path, 'update', value);
    expect(store.getValueByPath(path)).toBe(value);
  });

  it('create', () => {
    const path = new RefId('array');
    const item = {
      test: 321,
    };
    const originSize = store.getValueByPath(path).size;
    store.onChange(path, 'create', item);
    expect(store.getValueByPath(path).size).toBe(originSize + 1);
  });

  it('create array in array', () => {
    const path = new RefId('array/0/array');
    const item = {
      test: 321,
    };
    const originSize = store.getValueByPath(path).size;
    store.onChange(path, 'create', item);
    expect(store.getValueByPath(path).size).toBe(originSize + 1);
  });

  it('create array in object', () => {
    const path = new RefId('object/array');
    const item = {
      test: 321,
    };
    const originSize = store.getValueByPath(path).size;
    store.onChange(path, 'create', item);
    expect(store.getValueByPath(path).size).toBe(originSize + 1);
  });

  it('delete', () => {
    const path = new RefId('array/1');
    store.onChange(path, 'delete');
    expect(store.getValueByPath(path.remove()).size).toBe(1);
  });

  it('delete array in object', () => {
    const path = new RefId('object/array/1');
    store.onChange(path, 'delete');
    expect(store.getValueByPath(path.remove()).size).toBe(1);
  });

  it('swap', () => {
    const refId = new RefId('array');
    const path = {
      firstRefId: refId.child(0),
      secondRefId: refId.child(1),
    };
    const origin1 = store.getValueByPath(path.firstRefId).toJS();
    const origin2 = store.getValueByPath(path.secondRefId).toJS();

    store.onChange(path, 'swap');
    expect(store.getValueByPath(path.firstRefId).toJS()).toEqual(origin2);
    expect(store.getValueByPath(path.secondRefId).toJS()).toEqual(origin1);
  });

  it('swap in object', () => {
    const refId = new RefId('object/array');
    const path = {
      firstRefId: refId.child(0),
      secondRefId: refId.child(1),
    };
    const origin1 = store.getValueByPath(path.firstRefId).toJS();
    const origin2 = store.getValueByPath(path.secondRefId).toJS();

    store.onChange(path, 'swap');
    expect(store.getValueByPath(path.firstRefId).toJS()).toEqual(origin2);
    expect(store.getValueByPath(path.secondRefId).toJS()).toEqual(origin1);
  });
});
