// tslint:disable:no-unused-expression
import PrismaClient from '../src/graphqlClient/prismaClient';
import Resolver from '../src/resolver';
import pick from 'lodash/pick';
import { graphql } from 'graphql-anywhere/lib/async';
import gql from 'graphql-tag';
import { getMainDefinition } from 'apollo-utilities';
import { execute, makePromise, ApolloLink } from 'apollo-link';
import * as chai from 'chai';
import { createLink } from '../src/link';
import { schema } from './constants';
import pluralize from 'pluralize';
import { mapKeys, capitalize } from 'lodash';
const expect = chai.expect;
const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
interface Result { [index: string]: any; }
import { queryOne, listQuery, mapQuery, listMutation, mapMutation, emptyData } from './testsuit';
const schemaForPrisma = mapKeys(schema, (val, key) => {
  return capitalize(pluralize.singular(key));
});

describe('PrismaClient', () => {
  let graphqlResolve;
  const defaultData: any = {};
  before(async () => {
    const graphqlClient = new PrismaClient();
    const link = createLink({
      schema: schemaForPrisma,
      graphqlClient
    });
    // setup data
    await graphqlClient.prepare({
      secret: 'secret',
      appId: 'appId',
      schema: schemaForPrisma
    });

    graphqlResolve = async (query, variables?) => {
      const {data} = await makePromise<Result>(
        execute(link, {
          query,
          variables
        })
      );
      return data;
    };
    // put data
    const posts = [
      {
        title: 'a123',
        tags: {set: ['node']},
        notes: {set: [{text: 'note1'}, {text: 'note2'}]}
      },
      {
        title: 'b123',
        notes: {set: [{text: 'note3'}, {text: 'note4'}]}
      },
      {
        title: 'c123',
        notes: {set: [{text: 'note5'}, {text: 'note6'}]}
      },
      {
        title: 'd123',
        notes: {set: [{text: 'note7'}, {text: 'note8'}]}
      }
    ];

    const responses = await Promise.all(posts.map(post => {
      return graphqlResolve(gql`
      mutation($payload: PostCreateInput!) {
        createPost(data: $payload) {
          id
          title
        }
      }
      `, {
        payload: post
      });
    }));
    const postIdsWhere = responses
    .sort(res => res.createPost.title)
    .map(res => {
      return {
        id: res.createPost.id
      };
    });

    const users = [
      {
        age: 10,
        name: 'user1',
        email: 'wwwy3y3@gmail.com',
        images: {set: [{url: 'url'}]},
        posts: {
          connect: postIdsWhere.slice(0, 2)
        }
      },
      {
        age: 20,
        name: 'user2',
        email: 'wwwy3y3@gmail.com',
        images: {set: [{url: 'url'}]},
        posts: {
          connect: postIdsWhere.slice(2)
        }
      }
    ];
    await Promise.all(users.map(user => {
      return graphqlResolve(gql`
      mutation($payload: UserCreateInput!) {
        createUser(data: $payload) {
          id
        }
      }
      `, {
        payload: user
      });
    }));

    // bind data to default data
    const postData = await graphqlResolve(gql`
    query {
      posts (orderBy: title_ASC) {
        id
        title
        tags
        author {
          id
        }
        notes
      }
    }
    `);
    defaultData.posts = postData.posts.map(post => {
      return {
        ...post,
        author: post.author.id
      };
    });
    const userData = await graphqlResolve(gql`
    query {
      users (orderBy: age_ASC) {
        id
        name
        age
        email
        images
        posts {
          id
        }
      }
    }
    `);
    defaultData.users = userData.users.map(user => {
      return {
        ...user,
        posts: user.posts.map(post => post.id)
      };
    });
  });

  after(async () => {
    await graphqlResolve(gql`
    mutation {
      deleteManyPosts {
        count
      }
    }
    `);
    await graphqlResolve(gql`
    mutation {
      deleteManyUsers {
        count
      }
    }
    `);
  });

  describe('query one', () => {
    it('should query one with where', async () => {
      const result = await graphqlResolve(gql`
        {
          post(where: {id: "${defaultData.posts[0].id}"}) {
            id
            title
            tags
            __typename
          }
        }
      `);
      expect(result.post).to.be.eql({
        ...pick(defaultData.posts[0], ['id', 'title', 'tags']),
        __typename: 'Post'
      });

      const resultSecond = await graphqlResolve(gql`
        {
          post(where: {id: "${defaultData.posts[1].id}"}) {
            id
            title
            tags
            __typename
          }
        }
      `);
      expect(resultSecond.post).to.be.eql({
        ...pick(defaultData.posts[1], ['id', 'title']),
        tags: [],
        __typename: 'Post'
      });
    });

    it('should query one with relation toOne field', async () => {
      const result = await graphqlResolve(gql`
        {
          post(where: {id: "${defaultData.posts[0].id}"}) {
            id
            title
            __typename
            author {
              __typename
              id
              name
              email
            }
          }
        }
      `);
      expect(result.post).to.be.eql({
        ...pick(defaultData.posts[0], ['id', 'title']),
        author: {
          __typename: 'User',
          ...pick(defaultData.users[0], ['id', 'name', 'email']),
        },
        __typename: 'Post'
      });
    });

    it('should query one with nested array', async () => {
      const result = await graphqlResolve(gql`
        {
          post(where: {id: "${defaultData.posts[0].id}"}) {
            id
            title
            __typename
            notes {
              __typename
              text
            }
          }
        }
      `);
      expect(result.post).to.be.eql({
        ...pick(defaultData.posts[0], ['id', 'title']),
        notes: defaultData.posts[0].notes.map(note => {
          return {
            ...note,
            // __typename: null
          };
        }),
        __typename: 'Post'
      });
    });

    it('should query one with nested toMany', async () => {
      const result = await graphqlResolve(gql`
        {
          user(where: {id: "${defaultData.users[0].id}"}) {
            id
            name
            __typename
            posts {
              __typename
              id
              title
            }
          }
        }
      `);
      expect(result.user).to.include({
        __typename: 'User',
        ...pick(defaultData.users[0], ['id', 'name'])
      });
      expect(result.user.posts.length).to.be.eql(2);
    });
  });

  /**
   * Query List
   */
  describe('query list', () => {
    it('should query with comparator', async () => {
      const result = await graphqlResolve(gql`
        {
          users(where: {age_gt: 10}) {
            id
            age
            __typename
          }
        }
      `);
      expect(result.users.length).to.be.eql(1);
      expect(result.users[0]).to.be.eql({
        ...pick(defaultData.users[1], ['id', 'age']),
        __typename: 'User'
      });
    });

    it('should query with comparator & order', async () => {
      const result = await graphqlResolve(gql`
        {
          users(where: {age_gt: 5}, orderBy: age_DESC) {
            id
            age
            __typename
          }
        }
      `);
      expect(result.users.length).to.be.eql(2);
      expect(result.users[0].age > result.users[1].age).to.be.true;
    });

    it('should query with pagination', async () => {
      const result = await graphqlResolve(gql`
        {
          users(first: 1, after: "${defaultData.users[0].id}", orderBy: age_ASC) {
            id
            age
            __typename
          }
        }
      `);
      expect(result.users.length).to.be.eql(1);
      expect(result.users[0]).to.be.eql({
        ...pick(defaultData.users[1], ['id', 'age']),
        __typename: 'User'
      });
    });

    it('should query connection with pagination', async () => {
      const result = await graphqlResolve(gql`
        {
          usersConnection(first: 1, orderBy: age_ASC) {
            edges {
              cursor
              node {
                id
                age
                __typename
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `);
      expect(result.usersConnection.pageInfo).to.eql({
        // __typename: null,
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: defaultData.users[0].id,
        endCursor: defaultData.users[0].id
      });
      expect(result.usersConnection.edges.length).to.eql(1);
    });

    it('should query nested query', async () => {
      const result = await graphqlResolve(gql`
        {
          users {
            id
            age
            __typename
            images {
              url
            }
          }
        }
      `);

      expect(result.users.length).to.be.eql(2);
      expect(result.users[0].images[0]).to.be.eql({
        // __typename: null,
        ...defaultData.users[0].images[0]
      });
    });

    it('should query resolve toOne relation fields', async () => {
      const result = await graphqlResolve(gql`
        {
          posts (orderBy: title_ASC) {
            id
            title
            __typename
            author {
              __typename
              id
              name
              email
            }
          }
        }
      `);
      expect(result.posts.length).to.be.eql(4);
      expect(result.posts[0].author).to.be.eql({
        __typename: 'User',
        ...pick(defaultData.users[0], ['id', 'name', 'email'])
      });
      expect(result.posts[2].author).to.be.eql({
        __typename: 'User',
        ...pick(defaultData.users[1], ['id', 'name', 'email'])
      });
    });

    it('should query relation & resolve relation fields', async () => {
      const result = await graphqlResolve(gql`
        {
          posts(where: {author: {name: "user1"}}) {
            id
            title
            __typename
            author {
              __typename
              id
              name
              email
            }
          }
        }
      `);
      expect(result.posts.length).to.be.eql(2);
      expect(result.posts[0].author).to.be.eql({
        __typename: 'User',
        ...pick(defaultData.users[0], ['id', 'name', 'email'])
      });
    });

    // it('should query resolve toMany', async () => {
    //   const result = await graphqlResolve(gql`
    //     {
    //       users (orderBy: age_ASC) {
    //         id
    //         name
    //         __typename
    //         posts(first: 5) {
    //           __typename
    //           id
    //           title
    //           author {
    //             __typename
    //             name
    //           }
    //         }
    //       }
    //     }
    //   `);
    //   expect(result.users.length).to.be.eql(2);
    //   expect(result.users[0].posts.length).to.be.eql(2);
    //   expect(result.users[0].posts[0]).to.be.eql({
    //     __typename: 'Post',
    //     author: {
    //       __typename: 'User',
    //       ...pick(defaultData.users[0], ['name'])
    //     },
    //     ...pick(defaultData.posts[0], ['id', 'title'])
    //   });
    // });
  });

  /**
   * mutation
   */

  describe('mutation', () => {
    it('should create with create relation', async () => {
      const payload = {
        title: '123',
        tags: {set: ['hey']},
        author: {
          create: {
            name: 'new',
            age: 30
          }
        }
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id
            title
            tags
            author {
              __typename
              id
              name
              age
            }
          }
        }
      `, {payload});
      expect(mutationResult.createPost).to.have.property('id');
      expect(mutationResult.createPost.title).to.be.eql(payload.title);
      expect(mutationResult.createPost.tags).to.be.eql(payload.tags.set);
      expect(mutationResult.createPost.author).to.include({
        __typename: 'User',
        ...payload.author.create
      });

      const queryResult = await graphqlResolve(gql`
        {
          post(where: {id: "${mutationResult.createPost.id}"}) {
            id
            title
            tags
            __typename
            author {
              __typename
              id
              name
              age
            }
          }
        }
      `);
      expect(queryResult.post).to.be.eql({
        __typename: 'Post',
        ...mutationResult.createPost
      });
    });

    it('should update fields', async () => {
      const payload = {
        title: '123',
        tags: {set: ['hey']}
      };

      const update = {
        title: '1234',
        tags: {set: ['hey', 'hey2']}
      };

      // create
      const mutationResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id
          }
        }
      `, {payload});

      // update
      await graphqlResolve(gql`
        mutation($payload: PostUpdateInput!) {
          updatePost(data: $payload, where: {id: "${mutationResult.createPost.id}"}) {
            __typename
            id
          }
        }
      `, {payload: update});

      const queryResult = await graphqlResolve(gql`
        {
          post(where: {id: "${mutationResult.createPost.id}"}) {
            id
            title
            tags
            __typename
          }
        }
      `);
      expect(queryResult.post).to.be.eql({
        __typename: 'Post',
        id: mutationResult.createPost.id,
        ...update,
        tags: update.tags.set
      });
    });

    it('should create with connect relation', async () => {
      const payload = {
        title: '123',
        notes: {set: [{text: 'xx1234'}]},
        author: {
          connect: {
            id: defaultData.users[0].id
          }
        }
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id
            title
            notes {
              text
            }
            author {
              __typename
              id
              name
              age
            }
          }
        }
      `, {payload});
      expect(mutationResult.createPost).to.have.property('id');
      expect(mutationResult.createPost.title).to.be.eql(payload.title);
      expect(mutationResult.createPost.notes[0]).to.be.eql({
        // __typename: null,
        ...payload.notes.set[0]
      });
      expect(mutationResult.createPost.author).to.include({
        __typename: 'User',
        ...pick(defaultData.users[0], ['id', 'name', 'age'])
      });

      const queryResult = await graphqlResolve(gql`
        {
          post(where: {id: "${mutationResult.createPost.id}"}) {
            id
            title
            __typename
            notes {
              text
            }
            author {
              __typename
              id
              name
              age
            }
          }
        }
      `);
      expect(queryResult.post).to.be.eql({
        __typename: 'Post',
        ...mutationResult.createPost
      });
    });

    it('should update with toOne create', async () => {
      const createResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id
          }
        }
      `, {payload: {
        title: 'newPost',
        author: {
          create: {
            name: 'new',
            age: 30
          }
        }
      }});

      const payload = {
        title: 'newPostTitle',
        author: {
          create: {
            name: 'updateCreate'
          }
        }
      };

      const where = {
        id: createResult.createPost.id
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: PostUpdateInput!, $where: PostWhereUniqueInput!) {
          updatePost(data: $payload, where: $where) {
            __typename
            author {
              __typename
              name
            }
          }
        }
      `, {
        payload,
        where
      });

      expect(mutationResult.updatePost.author).to.be.eql({
        __typename: 'User',
        ...pick(payload.author.create, ['name'])
      });
    });

    it('should update with toOne connect', async () => {
      const createResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id
          }
        }
      `, {payload: {
        title: 'newPost',
        author: {
          create: {
            name: 'new',
            age: 30
          }
        }
      }});

      const payload = {
        title: 'newPostTitle',
        author: {
          connect: {
            id: defaultData.users[0].id
          }
        }
      };

      const where = {
        id: createResult.createPost.id
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: PostUpdateInput!, $where: PostWhereUniqueInput!) {
          updatePost(data: $payload, where: $where) {
            __typename
            author {
              __typename
              name
            }
          }
        }
      `, {
        payload,
        where
      });
      expect(mutationResult.updatePost.author).to.be.eql({
        __typename: 'User',
        ...pick(defaultData.users[0], ['name'])
      });
    });

    it('should update with toOne disconnect', async () => {
      const createResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id
            author {
              __typename
              id
            }
          }
        }
      `, {payload: {
        title: 'newPost',
        author: {
          create: {
            name: 'new',
            age: 30
          }
        }
      }});

      const payload = {
        title: 'newPostTitle',
        author: {
          disconnect: true
        }
      };

      const where = {
        id: createResult.createPost.id
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: PostUpdateInput!, $where: PostWhereUniqueInput!) {
          updatePost(data: $payload, where: $where) {
            __typename
            author {
              __typename
              name
            }
          }
        }
      `, {
        payload,
        where
      });
      expect(mutationResult.updatePost.author).to.be.eql(null);
    });

    it('should update with toOne delete', async () => {
      const createResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id,
            author {
              __typename
              id
            }
          }
        }
      `, {payload: {
        title: 'newPost',
        author: {
          create: {
            name: 'new',
            age: 30
          }
        }
      }});

      const payload = {
        title: 'newPostTitle',
        author: {
          delete: true
        }
      };

      const where = {
        id: createResult.createPost.id
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: PostUpdateInput!, $where: PostWhereUniqueInput!) {
          updatePost(data: $payload, where: $where) {
            __typename
            author {
              __typename
              name
            }
          }
        }
      `, {
        payload,
        where
      });
      expect(mutationResult.updatePost.author).to.be.eql(null);

      // make sure relation resource is deleted
      const queryResult = await graphqlResolve(gql`
        {
          user(where: {id: "${createResult.createPost.author.id}"}) {
            __typename
            id
          }
        }
      `);
      expect(queryResult.user).to.be.eql(null);
    });

    it('should delete with toOne delete', async () => {
      const createResult = await graphqlResolve(gql`
        mutation($payload: PostCreateInput!) {
          createPost(data: $payload) {
            __typename
            id,
            author {
              __typename
              id
            }
          }
        }
      `, {payload: {
        title: 'newPost',
        author: {
          create: {
            name: 'new',
            age: 30
          }
        }
      }});

      const payload = {
        author: {
          delete: true
        }
      };

      const where = {
        id: createResult.createPost.id
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: any, $where: PostWhereUniqueInput!) {
          deletePost(data: $payload, where: $where) {
            __typename
            id
          }
        }
      `, {
        payload,
        where
      });
      expect(mutationResult.deletePost).to.be.eql({
        __typename: 'Post',
        id: createResult.createPost.id
      });

      // make sure relation resource is deleted
      // no way prisma delete the related resource without cascading delete
    });

    /**
     * toMany
     */
    it('should create with toMany create & connect relation', async () => {
      const payload = {
        name: '123',
        posts: {
          create: [{
            title: 'new'
          }, {
            title: 'new2'
          }],
          connect: [{
            id: defaultData.posts[0].id
          }]
        }
      };

      const mutationResult = await graphqlResolve(gql`
        mutation($payload: UserCreateInput!) {
          createUser(data: $payload) {
            __typename
            id
            name
            posts {
              __typename
              id
              title
            }
          }
        }
      `, {payload});
      expect(mutationResult.createUser).to.have.property('id');
      expect(mutationResult.createUser.name).to.be.eql(payload.name);
      expect(mutationResult.createUser.posts.length).to.be.eql(3);

      const queryResult = await graphqlResolve(gql`
        {
          user(where: {id: "${mutationResult.createUser.id}"}) {
            __typename
            id
            name
            posts {
              __typename
              id
              title
            }
          }
        }
      `);
      expect(queryResult.user).to.be.eql({
        __typename: 'User',
        ...mutationResult.createUser
      });
    });

    it('should create with toMany create relation then update with create/connect/disconnect/delete', async () => {
      const createMutationResult = await graphqlResolve(gql`
        mutation($payload: UserCreateInput!) {
          createUser(data: $payload) {
            __typename
            id
            name
            posts {
              __typename
              id
              title
            }
          }
        }
      `, {
        payload: {
          name: '123',
          posts: {
            create: [{
              title: 'new'
            }, {
              title: 'new2'
            }]
          }
        }
      });

      // disconnect, delete
      const payload = {
        posts: {
          create: [{
            title: 'new3'
          }],
          connect: [{
            id: defaultData.posts[0].id
          }],
          disconnect: [{
            id: createMutationResult.createUser.posts[0].id
          }],
          delete: [{
            id: createMutationResult.createUser.posts[1].id
          }]
        }
      };

      await graphqlResolve(gql`
        mutation($payload: UserUpdateInput!, $where: UserWhereUniqueInput!) {
          updateUser(data: $payload, where: $where) {
            __typename
          }
        }
      `, {payload, where: {id: createMutationResult.createUser.id}});

      // check toMany
      const queryResult = await graphqlResolve(gql`
        {
          user(where: {id: "${createMutationResult.createUser.id}"}) {
            __typename
            id
            posts {
              __typename
              id
              title
            }
          }
        }
      `);
      expect(queryResult.user.posts.length).to.be.eql(2);

      // check delete
      const postResult = await graphqlResolve(gql`
        {
          post(where: {id: "${createMutationResult.createUser.posts[1].id}"}) {
            __typename
            id
          }
        }
      `);
      expect(postResult.post).to.be.eql(null);
    });

    it('should create with toMany create relation then update with create', async () => {
      const createMutationResult = await graphqlResolve(gql`
        mutation($payload: UserCreateInput!) {
          createUser(data: $payload) {
            __typename
            id
            name
            posts {
              __typename
              id
              title
            }
          }
        }
      `, {
        payload: {
          name: '123',
          posts: {
            create: [{
              title: 'new'
            }, {
              title: 'new2'
            }]
          }
        }
      });

      // disconnect, delete
      const payload = {
        posts: {
          connect: [{
            id: defaultData.posts[0].id
          }]
        }
      };

      await graphqlResolve(gql`
        mutation($payload: UserUpdateInput!, $where: UserWhereUniqueInput!) {
          updateUser(data: $payload, where: $where) {
            __typename
          }
        }
      `, {payload, where: {id: createMutationResult.createUser.id}});

      // check toMany
      const queryResult = await graphqlResolve(gql`
        {
          user(where: {id: "${createMutationResult.createUser.id}"}) {
            __typename
            id
            posts {
              __typename
              id
              title
            }
          }
        }
      `);
      expect(queryResult.user.posts.length).to.be.eql(3);
    });

    it('should create with toMany create relation then disconnect two', async () => {
      const createMutationResult = await graphqlResolve(gql`
        mutation($payload: UserCreateInput!) {
          createUser(data: $payload) {
            __typename
            id
            name
            posts {
              __typename
              id
              title
            }
          }
        }
      `, {
        payload: {
          name: '123',
          posts: {
            create: [{
              title: 'new'
            }, {
              title: 'new2'
            }, {
              title: 'new3'
            }]
          }
        }
      });

      // disconnect, delete
      const payload = {
        posts: {
          disconnect: [{
            id: createMutationResult.createUser.posts[0].id
          }, {
            id: createMutationResult.createUser.posts[1].id
          }]
        }
      };

      await graphqlResolve(gql`
        mutation($payload: UserUpdateInput!, $where: UserWhereUniqueInput!) {
          updateUser(data: $payload, where: $where) {
            __typename
          }
        }
      `, {payload, where: {id: createMutationResult.createUser.id}});

      // check toMany
      const queryResult = await graphqlResolve(gql`
        {
          user(where: {id: "${createMutationResult.createUser.id}"}) {
            __typename
            id
            posts {
              __typename
              id
              title
            }
          }
        }
      `);
      expect(queryResult.user.posts.length).to.be.eql(1);
    });
  });
});
