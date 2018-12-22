import {mapItems, enterSchema} from '../src/utils';

describe('mapItems', () => {
  it('should execute callback 2 times', () => {
    const func = jest.fn();
    const items = {
      info: {},
      posts: {},
    }
    mapItems(items, func);
    expect(func.mock.calls.length).toBe(2);
  });

  it('should execute callback 3 items', () => {
    const func = jest.fn();
    const items = {
      info: {
        type: 'object',
        items: {
          input: {
            type: 'string'
          }
        }
      },
      posts: {}
    };
    mapItems(items, func);
    expect(func.mock.calls.length).toBe(3);
  })
});

describe('enterSchema', () => {
  it('should execute callback 1 time', () => {
    const func = jest.fn();
    const schema = {
      type: 'string'
    };
    enterSchema(schema, func);
    expect(func.mock.calls.length).toBe(1);
  });

  it('should mapItems in array', () => {
    const func = jest.fn();
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        items: {
          title: {
            type: 'string'
          },
          content: {
            type: 'string'
          }
        }
      }
    };
    enterSchema(schema, func);
    expect(func.mock.calls.length).toBe(3);
  });

  it('should mapItems in object', () => {
    const func = jest.fn();
    const schema = {
      type: 'object',
      items: {
        title: {
          type: 'string'
        },
        content: {
          type: "string"
        }
      }
    }
    enterSchema(schema, func);
    expect(func.mock.calls.length).toBe(3);
  });

  it('should mapItems in nested', () => {
    const func = jest.fn();
    const schema = {
      type: 'object',
      items: {
        title: {
          type: 'array',
          items: {
            type: 'object',
            items: {
              title: {
                type: 'string'
              }
            }
          }
        },
        content: {
          type: "string"
        }
      }
    }
    enterSchema(schema, func);
    expect(func.mock.calls.length).toBe(4);
  });
})