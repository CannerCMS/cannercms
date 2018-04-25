import {objectToQueries} from '../../src/query/utils';

describe('object to quries', () => {
  it('should works', () => {
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
});