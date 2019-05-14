import {objectToQueries} from '../../src/query/utils';
import gql from 'graphql-tag';

describe('object to queries', () => {
  it('query should works', () => {
    const obj = {
      posts: {
        declareArgs: {
          $randomKey1: 'PostWhereInput',
          $randomKey2: 'PostOrderByInput',
          $randomKey3: 'String',
          $randomKey4: 'String',
          $randomKey5: 'Int',
          $randomKey6: 'Int'
        },
        args: {
          where: '$randomKey1',
          orderBy: '$randomKey2',
          after: '$randomKey3',
          before: '$randomKey4',
          first: '$randomKey5',
          last: '$randomKey6'
        },
        fields: {
          id: null,
          title: null,
          wildcard: undefined
        }
      }
    }
    const variables = {
      randomKey1: {},
      randomKey2: {},
      randomKey3: undefined,
      randomKey4: undefined,
      randomKey5: 10,
      randomKey6: undefined,
      randomKey7: undefined
    }
    expect(objectToQueries(obj, false, variables).replace(/\n+|\s+/g, '')).toBe(`
      query($randomKey1: PostWhereInput, $randomKey2: PostOrderByInput, $randomKey5: Int) {
        posts(where: $randomKey1, orderBy: $randomKey2, first: $randomKey5) {
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
    expect(objectToQueries(obj, false).replace(/\n+|\s+/g, '')).toBe(`
      mutation($payload: any, $where: any) {
        createPost(data: $payload, where: $where)
      }
    `.replace(/\n+|\s+/g, ''));
  });

  describe('with correct key name about case problem', () => {
    it('for ${KeyName}WhereInput', () => {
      const obj = {
        otherMenuItem: {
          declareArgs: {
            $randomKey1: 'otherMenuItemWhereInput',
          },
          args: {
            where: '$randomKey1',
          },
          fields: {
            id: null,
            title: null,
          }
        }
      }
      const variables = {randomKey1: {}};

      expect(objectToQueries(obj, false, variables).replace(/\n+|\s+/g, '')).toBe(`
        query($randomKey1: OthermenuitemWhereInput) {
          otherMenuItem(where: $randomKey1) {
            id
            title
          }
        }
      `.replace(/\n+|\s+/g, ''));
    });

    it('for ${KeyName}OrderByInput', () => {
      const obj = {
        otherMenuItem: {
          declareArgs: {
            $randomKey1: 'OthermenuitemWhereInput',
            $randomKey2: 'otherMenuItemOrderByInput',
            $randomKey3: 'Int',
          },
          args: {
            where: '$randomKey1',
            orderBy: '$randomKey2',
            first: '$randomKey3',
          },
          fields: {
            id: null,
            title: null,
          }
        }
      }
      const variables = {
        randomKey1: {},
        randomKey2: {},
        randomKey3: 10,
      };

      expect(objectToQueries(obj, false, variables).replace(/\n+|\s+/g, '')).toBe(`
        query($randomKey1: OthermenuitemWhereInput, $randomKey2: OthermenuitemOrderByInput, $randomKey3: Int) {
          otherMenuItem(where: $randomKey1, orderBy: $randomKey2, first: $randomKey3) {
            id
            title
          }
        }
      `.replace(/\n+|\s+/g, ''));
    });

  });
});

describe('integration', () => {
  test('query should works', () => {
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
    const query = objectToQueries(obj);
    expect(() => {
      gql`${query}`
    }).not.toThrow();
  });

  test('mutation should works', () => {
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
          },
        }
      }
    }
    const mutation = objectToQueries(obj, false);
    expect(() => {
      gql`${mutation}`
    }).not.toThrow();
  });
})