// tslint:disable:no-unused-expression
import * as chai from 'chai';
import gql from 'graphql-tag';
import { pick } from 'lodash';
const expect = chai.expect;

export let defaultData = {
  posts: [
    {id: '1', title: '123', tags: ['node'], author: '1', notes: [{text: 'note1'}, {text: 'note2'}]},
    {id: '2', title: '123', author: '2', notes: [{text: 'note3'}, {text: 'note4'}]}
  ],
  users: [
    {id: '1', age: 10, name: 'user1', email: 'wwwy3y3@gmail.com', images: [{url: 'url'}], posts: ['1', '2']},
    {id: '2', age: 20, name: 'user2', email: 'wwwy3y3@gmail.com', images: [{url: 'url'}], posts: ['1', '2']}
  ],
  CaptialUsers: [
    {id: '1', age: 10, name: 'user1', email: 'wwwy3y3@gmail.com', images: [{url: 'url'}], posts: ['1', '2']},
    {id: '2', age: 20, name: 'user2', email: 'wwwy3y3@gmail.com', images: [{url: 'url'}], posts: ['1', '2']}
  ],
  home: {
    header: {
      title: 'largeTitle',
      subTitle: 'subTitle'
    },
    count: 10,
    navs: [{text: 'nav1'}, {text: 'nav2'}],
    texts: ['hi', 'hi2'],
    staredPosts: ['1', '2'],
    bestAuthor: '1'
  }
};

export const queryOne = ({graphqlResolve, data}: {graphqlResolve?, data?}) => {
  defaultData = data || defaultData;
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
          __typename: null
        };
      }),
      __typename: 'Post'
    });
  });

  it('should query one with nested toMany', async () => {
    const result = await graphqlResolve(gql`
      {
        user(where: {id: "${defaultData.posts[0].id}"}) {
          id
          name
          __typename
          posts(first: 1) {
            id
            title
          }
        }
      }
    `);
    expect(result.user).to.be.eql({
      __typename: 'User',
      ...pick(defaultData.users[0], ['id', 'name']),
      posts: [{
        __typename: 'Post',
        ...pick(defaultData.posts[0], ['id', 'title'])
      }]
    });
  });
};

export const listQuery = ({graphqlResolve}) => {
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
        users(first: 1, after: "1") {
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
        usersConnection(first: 1) {
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
      __typename: null,
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: '1',
      endCursor: '1'
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
          images(first: 1) {
            url
          }
        }
      }
    `);

    expect(result.users.length).to.be.eql(2);
    expect(result.users[0].images[0]).to.be.eql({
      __typename: null,
      ...defaultData.users[0].images[0]
    });
  });

  it('should query resolve toOne relation fields', async () => {
    const result = await graphqlResolve(gql`
      {
        posts {
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
    expect(result.posts[1].author).to.be.eql({
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
    expect(result.posts.length).to.be.eql(1);
    expect(result.posts[0].author).to.be.eql({
      __typename: 'User',
      ...pick(defaultData.users[0], ['id', 'name', 'email'])
    });
  });

  it('should query resolve toMany', async () => {
    const result = await graphqlResolve(gql`
      {
        users {
          id
          title
          __typename
          posts(first: 5) {
            __typename
            id
            title
            author {
              __typename
              name
            }
          }
        }
      }
    `);
    expect(result.users.length).to.be.eql(2);
    expect(result.users[0].posts.length).to.be.eql(2);
    expect(result.users[0].posts[0]).to.be.eql({
      __typename: 'Post',
      author: {
        __typename: 'User',
        ...pick(defaultData.users[0], ['name'])
      },
      ...pick(defaultData.posts[0], ['id', 'title'])
    });
  });
};

/**
 * map query
 */
export const mapQuery = ({graphqlResolve}) => {
  it('should query map', async () => {
    const result = await graphqlResolve(gql`
      {
        home {
          __typename
          header {
            title
            subTitle
          }
          count
          navs {
            text
          }
          texts
          staredPosts(first: 5) {
            __typename
            id
            title
            author {
              __typename
              name
            }
          }
          bestAuthor {
            __typename
            id
            age
          }
        }
      }
    `);

    expect(result.home).to.be.eql({
      __typename: 'HomePayload',
      ...defaultData.home,
      header: {
        ...defaultData.home.header,
        __typename: null
      },
      navs: defaultData.home.navs.map(nav => {
        return {
          ...nav,
          __typename: null
        };
      }),
      bestAuthor: {
        __typename: 'User',
        ...pick(defaultData.users[0], ['id', 'age'])
      },
      staredPosts: defaultData.home.staredPosts.map(postId => {
        const post = defaultData.posts.find(e => e.id === postId);
        return {
          __typename: 'Post',
          ...pick(post, ['id', 'title']),
          author: {
            __typename: 'User',
            name: defaultData.users.find(user => user.id === post.author).name
          }
        };
      })
    });
  });
};

export const listMutation = ({graphqlResolve}) => {
  it('should create with create relation', async () => {
    const payload = {
      title: '123',
      tags: {set: ['hey']},
      notes: {set: [{text: 'text'}]},
      author: {
        create: {
          name: 'new',
          age: 30
        }
      }
    };

    const mutationResult = await graphqlResolve(gql`
      mutation($payload: any) {
        createPost(data: $payload) {
          __typename
          id
          title
          tags
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
    expect(mutationResult.createPost.tags).to.be.eql(payload.tags.set);
    expect(mutationResult.createPost.notes).to.be.eql(payload.notes.set.map(note => {
      return {
        __typename: null,
        ...note
      };
    }));
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
      mutation($payload: any) {
        createPost(data: $payload) {
          __typename
          id
        }
      }
    `, {payload});

    // update
    await graphqlResolve(gql`
      mutation($payload: any) {
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
          id: '1'
        }
      }
    };

    const mutationResult = await graphqlResolve(gql`
      mutation($payload: any) {
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
      __typename: null,
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
      mutation($payload: any) {
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
      mutation($payload: any, $where: any) {
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
      mutation($payload: any) {
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
          id: '1'
        }
      }
    };

    const where = {
      id: createResult.createPost.id
    };

    const mutationResult = await graphqlResolve(gql`
      mutation($payload: any, $where: any) {
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
      mutation($payload: any) {
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
      mutation($payload: any, $where: any) {
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
      name: null
    });
  });

  it('should update with toOne delete', async () => {
    const createResult = await graphqlResolve(gql`
      mutation($payload: any) {
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
      mutation($payload: any, $where: any) {
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
      name: null
    });

    // make sure relation resource is deleted
    const queryResult = await graphqlResolve(gql`
      {
        user(where: {id: "${createResult.createPost.author.id}"}) {
          __typename
          id
        }
      }
    `);
    expect(queryResult.user).to.be.eql({
      __typename: 'User',
      id: null
    });
  });

  it('should delete with toOne delete', async () => {
    const createResult = await graphqlResolve(gql`
      mutation($payload: any) {
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
      mutation($payload: any, $where: any) {
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
    const queryResult = await graphqlResolve(gql`
      {
        user(where: {id: "${createResult.createPost.author.id}"}) {
          __typename
          id
        }
      }
    `);
    expect(queryResult.user).to.be.eql({
      __typename: 'User',
      id: null
    });
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
          id: '1'
        }]
      }
    };

    const mutationResult = await graphqlResolve(gql`
      mutation($payload: any) {
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
      mutation($payload: any) {
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
          id: '1'
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
      mutation($payload: any, $where: any) {
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
    expect(postResult.post).to.be.eql({
      __typename: 'Post',
      id: null
    });
  });

  it('should create with toMany create relation then update with create', async () => {
    const createMutationResult = await graphqlResolve(gql`
      mutation($payload: any) {
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
          id: '1'
        }]
      }
    };

    await graphqlResolve(gql`
      mutation($payload: any, $where: any) {
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
      mutation($payload: any) {
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
      mutation($payload: any, $where: any) {
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
};

export const mapMutation = ({graphqlResolve}) => {
  it('should mutate map', async () => {
    const payload = {
      header: {
        title: 'newTitle',
        subTitle: 'newsubTitle'
      },
      count: 10,
      navs: {set: [{text: 'newText'}]},
      texts: {set: ['text']},
      staredPosts: {
        create: [{
          title: 'newTitle'
        }]
      },
      bestAuthor: {
        create: {
          age: 55
        }
      }
    };
    const result = await graphqlResolve(gql`
      mutation($data: any) {
        updateHome (data: $data) {
          __typename
          header {
            title
            subTitle
          }
          count
          texts
          navs {
            text
          }
          staredPosts(first: 5) {
            __typename
            id
            title
            author {
              __typename
              name
            }
          }
          bestAuthor {
            __typename
            id
            age
          }
        }
      }
    `, {
      data: payload
    });
    expect(result.updateHome.header).to.be.eql({
      __typename: null,
      ...payload.header
    });
    expect(result.updateHome.count).to.be.eql(payload.count);
    expect(result.updateHome.texts).to.be.eql(payload.texts.set);
    expect(result.updateHome.navs).to.be.eql(payload.navs.set.map(nav => {
      return {
        __typename: null,
        ...nav
      };
    }));
    expect(result.updateHome.staredPosts.length).to.be.eql(3);
    expect(result.updateHome.bestAuthor.age).to.be.eql(payload.bestAuthor.create.age);
  });

  it('should mutate map toOne field with connect', async () => {
    const payload = {
      bestAuthor: {
        connect: {
          id: '1'
        }
      }
    };
    const result = await graphqlResolve(gql`
      mutation($data: any) {
        updateHome (data: $data) {
          __typename
          bestAuthor {
            __typename
            id
            age
          }
        }
      }
    `, {
      data: payload
    });
    expect(result.updateHome.bestAuthor).to.be.eql({
      __typename: 'User',
      ...pick(defaultData.users[0], ['id', 'age'])
    });
  });

  it('should mutate map toMany field with disconnect', async () => {
    const payload = {
      staredPosts: {
        disconnect: [{
          id: '1'
        }]
      }
    };
    const result = await graphqlResolve(gql`
      mutation($data: any) {
        updateHome (data: $data) {
          __typename
          staredPosts(first: 5) {
            __typename
            id
            title
            author {
              __typename
              name
            }
          }
        }
      }
    `, {
      data: payload
    });
    expect(result.updateHome.staredPosts.length).to.be.eql(2);
  });

  it('should mutate map toMany field with connect', async () => {
    const payload = {
      staredPosts: {
        connect: [{
          id: '1'
        }]
      }
    };
    const result = await graphqlResolve(gql`
      mutation($data: any) {
        updateHome (data: $data) {
          __typename
          staredPosts(first: 5) {
            __typename
            id
            title
            author {
              __typename
              name
            }
          }
        }
      }
    `, {
      data: payload
    });
    expect(result.updateHome.staredPosts.length).to.be.eql(3);
  });
};

export const emptyData = ({graphqlResolve}) => {
  it('should read emtpy object', async () => {
    const result = await graphqlResolve(gql`
      {
        emptyObject {
          __typename
          header {
            title
            subTitle
          }
          count
          navs {
            text
          }
          texts
          staredPosts(first: 5) {
            __typename
            id
            title
            author {
              __typename
              name
            }
          }
          bestAuthor {
            __typename
            id
            age
          }
        }
      }
    `);
    expect(result.emptyObject).to.be.eql({
      __typename: 'EmptyObjectPayload',
      header: {
        __typename: null,
        title: null,
        subTitle: null
      },
      count: null,
      texts: [],
      navs: [],
      staredPosts: [],
      bestAuthor: { __typename: 'User', id: null, age: null }
    });
  });
};

export const caseInsensitive = ({graphqlResolve, data}: {graphqlResolve?, data?}) => {
  defaultData = data || defaultData;
  it('should query one with where with uncapital query', async () => {
    const result = await graphqlResolve(gql`
      {
        captialUser(where: {id: "${defaultData.CaptialUsers[0].id}"}) {
          id
          __typename
        }
      }
    `);
    expect(result.captialUser).to.be.eql({
      ...pick(defaultData.CaptialUsers[0], ['id']),
      __typename: 'CaptialUser'
    });
  });
};
