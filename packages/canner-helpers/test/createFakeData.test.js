import {createFakeData} from '../src';
import {getRandomNumber, randomImg} from '../src/createFakeData';

describe('null', () => {
  it('should return null', () => {
    expect(createFakeData()).toBe(null);
  });
});

describe('Non-exist type', () => {
  it('should return undefined', () => {
    expect(createFakeData({
      type: 'NON_EXIST_TYPE'
    })).toBe(undefined);
  });
});

describe('create string data', () => {
  it('should return a string', () => {
    expect(typeof createFakeData({
      type: 'string'
    })).toBe('string');
  });

  it('should be different', () => {
    expect(createFakeData({
      type: 'string'
    })).not.toBe(createFakeData({
      type: 'string'
    }));
  });

  it('should gen email format', () => {
    expect(createFakeData({
      type: 'string',
      keyName: 'userEmail'
    }).indexOf('@') > -1).toBe(true);
  });

  it('should gen phone format', () => {
    expect(createFakeData({
      type: 'string',
      keyName: 'userPhone'
    }).match(/\d/)).toBeDefined();
  });
});


describe('create enum data', () => {
  it('should return a string', () => {
    expect(typeof createFakeData({
      type: 'enum',
      values: ['a', 'b']
    })).toBe('string');
  });

  it('should be one of values', () => {
    expect(['a', 'b'].includes(createFakeData({
      type: 'enum',
      values: ['a', 'b']
    }))).toBe(true);
  });
});

describe('create boolean data', () => {
  it('should return a boolean value', () => {
    expect(typeof createFakeData({
      type: 'boolean'
    })).toBe('boolean');
  });
});

describe('create number data', () => {
  it('should return a number', () => {
    expect(typeof createFakeData({
      type: 'number'
    })).toBe('number');
  });

  it('should be different', () => {
    expect(createFakeData({
      type: 'number'
    })).not.toBe(createFakeData({
      type: 'number'
    }));
  });
});

describe('create geoPoint data', () => {
  it('should return a geo object', () => {
    const geoPoint = createFakeData({
      type: 'geoPoint'
    });
    expect(typeof geoPoint.lat).toBe('string');
    expect(typeof geoPoint.lng).toBe('string');
    expect(typeof geoPoint.address).toBe('string');
    expect(typeof geoPoint.placeId).toBe('string');
  });

  it('should be different', () => {
    expect(createFakeData({
      type: 'geoPoint'
    }).lat).not.toBe(createFakeData({
      type: 'geoPoint'
    }).lat);
  });
});

describe('create dateTime data', () => {
  it('should return a date string', () => {
    expect(createFakeData({
      type: 'dateTime',
    })).toMatch(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))(.)*/);
  });

  it('should be different', () => {
    expect(createFakeData({
      type: 'dateTime',
    })).not.toBe(createFakeData({
      type: 'dateTime',
    }));
  });
});

describe('create file data', () => {
  it('should return a file', () => {
    const data = createFakeData({
      type: 'file',
    });
    expect(typeof data.name).toBe('string');
    expect(typeof data.contentType).toBe('string');
    expect(typeof data.size).toBe('number');
    expect(typeof data.url).toBe('string');
  });

  it('should be different', () => {
    expect(createFakeData({
      type: 'file'
    }).name).not.toBe(createFakeData({
      type: 'file'
    }).name);
  });
});

describe('create image data', () => {
  it('should return an image', () => {
    const data = createFakeData({
      type: 'image',
    });
    expect(typeof data.name).toBe('string');
    expect(typeof data.contentType).toBe('string');
    expect(typeof data.size).toBe('number');
    expect(typeof data.url).toBe('string');
  });

  it('should be different', () => {
    expect(createFakeData({
      type: 'image'
    }).name).not.toBe(createFakeData({
      type: 'image'
    }).name);
  });
});

describe('create json empty data', () => {
  it('should return empty object', () => {
    expect(createFakeData({
      type: 'json'
    })).toEqual({});
  });
});

describe('create object data', () => {
  it('should return object with fileds', () => {
    const data = createFakeData({
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
    });
    expect(typeof data.input).toBe('string');
    expect(typeof data.boolean).toBe('boolean');
    expect(typeof data.number).toBe('number');
  });

  it('should return array of object', () => {
    const data = createFakeData({
      info: {
        type: 'object',
        keyName: 'info',
        items: {
          hobbies: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    }, 5);

    expect(data.info).toBeDefined();
    expect(Array.isArray(data.info.hobbies)).toBe(true);
    expect(data.info.hobbies.length).toBe(5);
    expect(typeof data.info.hobbies[0]).toBe('string');
  });
});

describe('create an array data', () => {
  it('should return []', () => {
    expect(createFakeData({
      type: 'array',
    })).toEqual([]);
  });

  it('should return an non-empty arrary of object', () => {
    const listLength = 3;
    expect(createFakeData({
      type: 'array',
      items: {
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
      }
    }, listLength).length).toBe(listLength);
  });

  it('should return an non-empty arrary of string', () => {
    const listLength = 3;
    expect(createFakeData({
      type: 'array',
      items: {
        type: 'string'
      }
    }, listLength).length).toBe(listLength);

    expect(typeof createFakeData({
      type: 'array',
      items: {
        type: 'string'
      }
    }, listLength)[0]).toBe('string');
  });
});


describe('create relation empty data', () => {
  it('should return null', () => {
    expect(createFakeData({
      type: 'relation',
      relation: {
        type: 'toOne'
      }
    })).toBe(null);
  });

  it('should return toOne relation data with null', () => {
    expect(createFakeData({
      posts: {
        keyName: 'posts',
        type: 'array',
        items: {
          author: {
             type: 'relation',
             relation: {
               to: 'users',
               type: 'toOne' 
             } 
          }
        }
      }
    }, 2)).toEqual({"posts": [{"author": null, "id": "posts1"}, {"author": null, "id": "posts2"}]});
  });

  it('should return toOne relation data ', () => {
    expect(typeof createFakeData({
      posts: {
        keyName: 'posts',
        type: 'array',
        items: {
          author: {
             type: 'relation',
             relation: {
               to: 'users',
               type: 'toOne' 
             } 
          }
        }
      },
      users: {
        type: 'array',
        items: {
          keyName: 'name',
          type: 'string'
        }
      }
    }, 2).posts[0].author).toBe('string');
  });

  it('should return {}', () => {
    expect(createFakeData({
      type: 'relation',
      relation: {
        type: 'toMany'
      }
    })).toEqual([]);
  });

  it('should return toMany relation data', () => {
    expect(createFakeData({
      posts: {
        keyName: 'posts',
        type: 'array',
        items: {
          authors: {
             type: 'relation',
             relation: {
               to: 'users',
               type: 'toMany' 
             } 
          }
        }
      }
    }, 2)).toEqual({"posts": [{"authors": [], "id": "posts1"}, {"authors": [], "id": "posts2"}]});
  });

  it('should return toMany relation data', () => {
    const data = createFakeData({
      posts: {
        keyName: 'posts',
        type: 'array',
        items: {
          authors: {
             type: 'relation',
             relation: {
               to: 'users',
               type: 'toMany' 
             } 
          }
        }
      },
      users: {
        type: 'array',
        items: {
          keyName: 'name',
          type: 'string'
        }
      }
    }, 2).posts[0].authors;
    expect(Object.keys(data)).toBeDefined();
  });
})

describe('getRandomNumber', () => {
  it.each`
    min | max
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
    ${2} | ${5}
  `('should get number between $min and $max', ({min, max}) => {
    const number = getRandomNumber(min, max);
    expect(number <= max).toBe(true);
    expect(number >= min).toBe(true);
  })
});

describe('randomImg', () => {
  test('should get valid placimg url', () => {
    expect(randomImg()).toMatch(/https:\/\/placeimg.com\/\d+\/\d+\/any/);
  })
});