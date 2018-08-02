export const defaultData = {
  posts: [
    {id: '1', title: '123', author: '1', notes: [{text: 'note1'}, {text: 'note2'}]},
    {id: '2', title: '123', author: '2', notes: [{text: 'note3'}, {text: 'note4'}]}
  ],
  users: [
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
    staredPosts: ['1', '2'],
    bestAuthor: '1'
  }
};

export const schema = {
  posts: {
    type: 'array',
    items: {
      type: 'object',
      items: {
        id: {
          type: 'id',
        },
        title: {
          type: 'string'
        },
        author: {
          type: 'relation',
          relation: {
            type: 'toOne',
            to: 'users'
          }
        },
        notes: {
          type: 'array',
          items: {
            type: 'object',
            items: {
              text: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  },

  // users
  users: {
    type: 'array',
    items: {
      type: 'object',
      items: {
        id: {
          type: 'id'
        },
        age: {
          type: 'int'
        },
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

  // home
  home: {
    type: 'object',
    items: {
      header: {
        type: 'object',
        items: {
          title: {
            type: 'string'
          },
          subTitle: {
            type: 'string'
          }
        }
      },
      count: {
        type: 'int'
      },
      navs: {
        type: 'array',
        items: {
          type: 'object',
          items: {
            text: {
              type: 'string'
            }
          }
        }
      },
      staredPosts: {
        type: 'relation',
        relation: {
          type: 'toMany',
          to: 'posts'
        }
      },
      bestAuthor: {
        type: 'relation',
        relation: {
          type: 'toOne',
          to: 'users',
        }
      }
    }
  }
};
