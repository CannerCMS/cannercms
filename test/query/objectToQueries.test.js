import {objectToQueries} from '../../src/query/utils';

describe('object to quries', () => {
  it('query should works', () => {
    const obj = {
      posts: {
        args: {
          pagination: {
            first: 10
          }
        },
        fields: {
          id: null,
          title: null
        }
      }
    }
    expect(objectToQueries(obj).replace(/\n+|\s+/g, '')).toBe(`
      {
        posts(pagination: {first: 10}) {
          id
          title
        }
      }
    `.replace(/\n+|\s+/g, ''));
  });

  it('mutation should works', () => {
    const obj = {
      mutation: {
        args: {
          $payload: 'any',
          $where: 'any'
        },
        fields: {
          createPost: {
            args: {
              data: '$payload',
              where: '$where'
            }
          }
        }
      }
    }
    expect(objectToQueries(obj).replace(/\n+|\s+/g, '')).toBe(`
      {
        mutation($payload: any, $where: any) {
          createPost(data: $payload, where: $where)
        }
      }
    `.replace(/\n+|\s+/g, ''));
  });
});