import {Query} from '../../src/query';
import {schemaToQueriesObject} from '../../src/query/utils';

describe('query', () => {
  let schema, queries, query, variables;
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
    queries = schemaToQueriesObject(schema, schema, {firstLayer: true}).queriesObj;
    variables = schemaToQueriesObject(schema, schema, {firstLayer: true}).variables;
    query = new Query({
      schema
    });
  });

  it('should have variables', () => {
    expect(query.variables).toEqual(variables);
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
      orderBy: 'title_DESC'
    });
    expect(query.variables.$postsOrderBy).toEqual('title_DESC');
  });

  it('should get gql when toolbar sync', () => {
    expect(query.toGQL('posts')).toEqual(`query($postsWhere: PostWhereInput){posts: postsConnection(where: $postsWhere){edges{cursor node{title id}} pageInfo{hasNextPage hasPreviousPage startCursor endCursor}}}`);
  });

  it('should get gql when toolbar async', () => {
    schema.posts.toolbar = {
      async: true
    }
    query = new Query({
      schema
    });
    expect(query.toGQL('posts')).toEqual(`query($postsFirst: Int,$postsWhere: PostWhereInput){posts: postsConnection(first: $postsFirst,where: $postsWhere){edges{cursor node{title id}} pageInfo{hasNextPage hasPreviousPage startCursor endCursor}}}`);
  });
});