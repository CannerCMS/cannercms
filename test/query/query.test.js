import {Query} from '../../src/query';
import {schemaToQueriesObject} from '../../src/query/utils';

describe('query', () => {
  let schema, queries, query;
  beforeEach(() => {
    schema = {
      posts: {
        type: 'array',
        items: {
          type: 'object',
          items: {
            title: {
              type: 'string'
            }
          }
        }
      }
    };
    queries = schemaToQueriesObject(schema, schema, {firstLayer: true});
    query = new Query({
      schema
    });
  });

  it('should have queries', () => {
    expect(query.queries).toEqual(queries);
  });

  it('should get queries', () => {
    expect(query.getQueries([])).toEqual(queries);
  });

  it('should get posts queries', () => {
    expect(query.getQueries(['posts'])).toEqual(queries.posts);
  });

  it('should get posts/title queries', () => {
    expect(query.getQueries(['posts', 'title'])).toEqual(queries.posts.fields.title);
  });

  it('should update posts args', () => {
    query.updateQueries(['posts'], 'args', {
      pagination: {first: 2}
    });
    expect(query.queries.posts.args).toEqual({
      pagination: {first: 2}
    });
  });

  it('should get root gql', () => {
    expect(query.toGQL()).toEqual(`{posts(pagination: {first:10}){id title}}`);
  });

  it('should get posts gql', () => {
    expect(query.toGQL('posts')).toEqual(`{posts(pagination: {first:10}){id title}}`);
  });
});