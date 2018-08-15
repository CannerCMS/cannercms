import {createEmptyData} from '../src';

describe('creatEmptyData', () => {
  it('string', () => {
    expect(createEmptyData({
      type: 'string'
    })).toBe('');
  });

  it('boolean', () => {
    expect(createEmptyData({
      type: 'boolean'
    })).toBe(false);
  });

  it('number', () => {
    expect(createEmptyData({
      type: 'number'
    })).toBe(0);
  });

  it('geoPoint', () => {
    expect(createEmptyData({
      type: 'geoPoint'
    })).toEqual({
      __typename: null,
      lat: 0,
      lng: 0,
      placeId: ''
    });
  });

  it('dateTime', () => {
    expect(createEmptyData({
      type: 'dateTime',
    })).toEqual('');
  });

  it('file', () => {
    expect(createEmptyData({
      type: 'file',
    })).toEqual({
      __typename: null,
      contentType: "",
      name: "",
      size: 0, url: ""
    });
  });

  it('image', () => {
    expect(createEmptyData({
      type: 'image',
    })).toEqual({
      __typename: null,
      contentType: "",
      name: "",
      size: 0, url: ""
    });
  });

  it('json', () => {
    expect(createEmptyData({
      type: 'json'
    })).toEqual({});
  });

  it('object', () => {
    expect(createEmptyData({
      type: 'object',
      items: {
        input: {
          type: 'string'
        },
        boolean: {
          type: 'boolean'
        },
        number: {
          type: 'number'
        }
      }
    })).toEqual({
      __typename: null,
      input: '',
      boolean: false,
      number: 0
    });
  });

  it('array of string', () => {
    expect(createEmptyData({
      type: 'array',
    })).toEqual([]);
  });

  describe('relation', () => {
    it('toOne', () => {
      expect(createEmptyData({
        type: 'relation',
        relation: {
          type: 'toOne'
        }
      })).toBe(null);
    });

    it('toMany', () => {
      expect(createEmptyData({
        type: 'relation',
        relation: {
          type: 'toMany'
        }
      })).toEqual([]);
    });
  })
});
