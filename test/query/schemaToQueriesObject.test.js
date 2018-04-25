import {schemaToQueriesObject} from '../../src/query/utils';

describe('schema to queries object', () => {
  let schema, queriesObject;
  beforeEach(() => {
    schema = {
      posts: {
        keyName: 'posts',
        type: 'array',
        items: {
          type: 'object',
          items: {
            title: {
              keyName: 'title',
              type: 'string',
            }
          }
        }
      }
    };
    queriesObject = {
      posts: {
        isPlural: true,
        args: {
          pagination: {first: 10} // default
        },
        fields: {
          id: null,
          title: null
        }
      }
    }
  })

  it('should works', () => {
    expect(schemaToQueriesObject(schema)).toEqual(queriesObject);
  });
});