import {createEmptyData} from '../src';
import {genDefaultValue} from '../src/createEmptyData';

describe('create string empty data', () => {
  it('should return empty string', () => {
    expect(createEmptyData({
      type: 'string'
    })).toBe('');
  });

  it('should return 123', () => {
    expect(createEmptyData({
      type: 'string',
      defaultValue: '123'
    }));
  })
});

describe('create boolean empty data', () => {
  it('should return false', () => {
    expect(createEmptyData({
      type: 'boolean'
    })).toBe(false);
  });
});

describe('create number empty data', () => {
  it('should return 0', () => {
    expect(createEmptyData({
      type: 'number'
    })).toBe(0);
  });
});

describe('create geoPoint empty data', () => {
  it('should return object {lat:0, lng:0, placeId: \'\', _typename: null}', () => {
    expect(createEmptyData({
      type: 'geoPoint'
    })).toEqual({
      __typename: null,
      lat: 0,
      lng: 0,
      placeId: ''
    });
  });
});

describe('create dateTime empty data', () => {
  it('should return empty string', () => {
    expect(createEmptyData({
      type: 'dateTime',
    })).toEqual('');
  });
});

describe('create file empty data', () => {
  it('should return empty file', () => {
    expect(createEmptyData({
      type: 'file',
    })).toEqual({
      __typename: null,
      contentType: "",
      name: "",
      size: 0, url: ""
    });
  });
});

describe('create image empty data', () => {
  it('should return image empty data', () => {
    expect(createEmptyData({
      type: 'image',
    })).toEqual({
      __typename: null,
      contentType: "",
      name: "",
      size: 0, url: ""
    });
  });
});

describe('create json empty data', () => {
  it('should return empty object', () => {
    expect(createEmptyData({
      type: 'json'
    })).toEqual({});
  });
});

describe('create object empty data', () => {
  it('should return object with fileds', () => {
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
});

describe('create array of string empty data', () => {
  it('should return []', () => {
    expect(createEmptyData({
      type: 'array',
    })).toEqual([]);
  });
});


describe('create relation empty data', () => {
  it('should return null', () => {
    expect(createEmptyData({
      type: 'relation',
      relation: {
        type: 'toOne'
      }
    })).toBe(null);
  });

  it('should return []', () => {
    expect(createEmptyData({
      type: 'relation',
      relation: {
        type: 'toMany'
      }
    })).toEqual([]);
  });
})


describe('genDefaultValue', () => {
  it('should return value with given string', () => {
    const defaultValue = 'value';
    expect(genDefaultValue(defaultValue)).toBe(defaultValue);
  });

  it('should retrun value with given funciton', () => {
    const defaultValue = () => 'value';
    expect(genDefaultValue(defaultValue)).toBe(defaultValue());
  })
})