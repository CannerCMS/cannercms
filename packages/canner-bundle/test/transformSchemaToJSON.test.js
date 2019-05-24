/* eslint import/no-unresolved: 0 */
import { resolve } from '../src/utils/transformSchemaToJSON';

describe('resolve', () => {
  test('should remove component and page type', () => {
    const schema = {
      page: {
        type: 'page',
        items: {
          test: {
            type: 'component',
          },
          test2: {
            type: 'component',
          },
        },
      },
      array: {
        type: 'array',
        items: {
          type: 'object',
          items: {
            test1: {
              type: 'string',
            },
            test2: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            test3: {
              type: 'component',
            },
          },
        },
      },
      object: {
        type: 'object',
        items: {
          test1: {
            type: 'string',
          },
          test2: {
            type: 'object',
            items: {
              test3: {
                type: 'string',
              },
              test4: {
                type: 'component',
              },
            },
          },
        },
      },
    };
    expect(resolve(schema)).toMatchInlineSnapshot(`
Object {
  "array": Object {
    "items": Object {
      "items": Object {
        "test1": Object {
          "type": "string",
        },
        "test2": Object {
          "items": Object {
            "type": "string",
          },
          "type": "array",
        },
        "test3": undefined,
      },
      "type": "object",
    },
    "type": "array",
  },
  "object": Object {
    "items": Object {
      "test1": Object {
        "type": "string",
      },
      "test2": Object {
        "items": Object {
          "test3": Object {
            "type": "string",
          },
          "test4": undefined,
        },
        "type": "object",
      },
    },
    "type": "object",
  },
  "page": undefined,
}
`);
  });
});
