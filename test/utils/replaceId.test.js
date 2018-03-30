import {findAndReplaceField, replaceField} from '../../src/app/utils/replaceId';
import {fromJS} from 'immutable';
const ID1 = '1';
const ID2 = '2';

describe('replaceId', () => {
  it('replaceField', () => {
    const newData = replaceField(fromJS({_id: ID1}), '_id', {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual({
      _id: ID2,
    });
  });

  it('findAndReplaceField - 1 layer', () => {
    const newData = findAndReplaceField(fromJS({_id: ID1}), ['_id'], {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual({
      _id: ID2,
    });
  });

  it('findAndReplaceField - 2 layer', () => {
    const newData = findAndReplaceField(fromJS({test: {_id: ID1}}), ['test', '_id'], {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual({test: {
      _id: ID2,
    }});
  });

  it('findAndReplaceField - 3 layer', () => {
    const newData = findAndReplaceField(fromJS({test1: {test2: {_id: ID1}}}), ['test1', 'test2', '_id'], {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual({
      test1:
      {
        test2: {
          _id: ID2,
        },
      },
    });
  });

  it('findAndReplaceField - collection 1 layer', () => {
    const newData = findAndReplaceField(fromJS([{_id: ID1}]), ['_id'], {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual([{
      _id: ID2,
    }]);
  });

  it('findAndReplaceField - collection 2 layer', () => {
    const newData = findAndReplaceField(fromJS([{test1: [{_id: ID1}]}]), ['test1', '_id'], {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual([{test1: [{_id: ID2}]}]);
  });

  it('findAndReplaceField - collection 3 layer', () => {
    const newData = findAndReplaceField(fromJS([{test1: [{test2: [{_id: ID1}]}]}]), ['test1', 'test2', '_id'], {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual([{test1: [{test2: [{_id: ID2}]}]}]);
  });

  it('findAndReplaceField - collection field', () => {
    const newData = findAndReplaceField(fromJS([{test: {cate: [ID1]}}]), ['test', 'cate'], {from: ID1, to: ID2});
    expect(newData.toJS()).toEqual([{test: {cate: [ID2]}}]);
  });
});
