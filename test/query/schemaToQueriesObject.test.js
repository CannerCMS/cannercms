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
            },
            staredPosts: {
              keyName: 'staredPosts',
              type: 'relation',
              relation: {
                type: 'toMany',
                to: 'posts'
              }
            },
            bestAuthor: {
              keyName: 'bestAuthor',
              type: 'relation',
              relation: {
                type: 'toOne',
                to: 'users',
                typename: 'User'
              }
            }
          }
        }
      },
      users: {
        type: 'array',
        items: {
          type: 'object',
          items: {
            name: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            images: {
              type: 'array',
              items: {
                type: 'image'
              }
            },
            posts: {
              type: 'relation',
              relation: {
                type: 'toMany',
                to: 'posts'
              }
            }
          }
        }
      },
    };
  })

  it('should works', () => {
    expect(schemaToQueriesObject(schema)).toMatchSnapshot();
  });
});