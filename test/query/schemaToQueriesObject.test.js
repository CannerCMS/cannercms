import {schemaToQueriesObject} from '../../src/query/utils';

describe('schema to queries object', () => {
  let schema;
  beforeEach(() => {
    schema = {
      posts: {
        keyName: 'posts',
        type: 'array',
        path: 'posts',
        items: {
          type: 'object',
          items: {
            title: {
              path: 'posts/title',
              keyName: 'title',
              type: 'string',
            },
            staredPosts: {
              path: 'posts/staredPosts',
              keyName: 'staredPosts',
              type: 'relation',
              relation: {
                type: 'toMany',
                to: 'posts'
              }
            },
            bestAuthor: {
              keyName: 'bestAuthor',
              path: 'posts/bestAuthor',
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
        path: 'users',
        items: {
          type: 'object',
          items: {
            name: {
              path: 'users/name',
              type: 'string'
            },
            email: {
              path: 'users/email',
              type: 'string'
            },
            images: {
              path: 'users/images',
              type: 'array',
              items: {
                type: 'image'
              }
            },
            posts: {
              path: 'users/posts',
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
    expect(schemaToQueriesObject(schema).queriesObj).toMatchSnapshot();
    expect(schemaToQueriesObject(schema).variables).toMatchSnapshot();
  });
});