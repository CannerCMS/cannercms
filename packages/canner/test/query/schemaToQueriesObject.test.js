import {schemaToQueriesObject} from '../../src/query/utils';

describe('schema to queries object', () => {
  it('should works', () => {
    const schema = {
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
            },
            images: {
              keyName: 'images',
              path: 'posts/images',
              type: 'array',
              items: {
                type: 'image'
              }
            },
            wildCard: {
              keyName: 'wildCard',
              path: 'posts/wildCard',
              type: 'component'
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
            },
            variants: {
              path: 'users/variants',
              type: 'json',
              items: {
                options: {
                  type: 'array'
                },
                variants: {
                  type: 'array'
                }
              }
            }
          }
        }
      },
    };
    expect(schemaToQueriesObject(schema)).toMatchSnapshot();
  });
});