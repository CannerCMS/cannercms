import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {schema, defaultData, getAuthorById} from './data';
import Provider from '../../src/components/Provider';
import {createClient, MemoryConnector} from 'canner-graphql-interface';
import {Query} from '../../src/query';
import gql from "graphql-tag";
Enzyme.configure({ adapter: new Adapter() });


function toGQL(schema, key) {
  const query = new Query({schema});
  query.toGQL(key);
  return gql`${query.toGQL(key)}`
}

describe('provider methods', () => {
  let client;
  beforeEach(() => {
    client = createClient({
      schema,
      connector: new MemoryConnector({
        defaultData
      })
    })
  });

  test('fetch object', () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
      routes={[]}
    >
      <div>children</div>
    </Provider>);
    return wrapper.instance().fetch('home').then(d => {
      expect(d).toMatchSnapshot();
    });
  });

  /**
   * the two test below is broken but dont know why
   */
  test('fetch array', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
      routes={[]}
    >
      <div>children</div>
    </Provider>)
    const data = await wrapper.instance().fetch('posts');
    function removePost(obj) {
      delete obj.posts;
      return obj;
    }
    expect(data).toMatchObject({
      posts: {
        edges: defaultData.posts.map(post => ({
          cursor: post.id,
          node: {...post, author: removePost(getAuthorById(post.author))}
        }))
      }
    });
  });

  test('updateQuery', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
      routes={[]}
    >
      <div>children</div>
    </Provider>)
    const originData = await wrapper.instance().fetch('posts');
    await wrapper.instance().updateQuery(['posts'], {where: {author: {name: "user2"}}});
    const newData = await wrapper.instance().fetch('posts');
    expect(originData).not.toEqual(newData);
  });

  test('request', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
      routes={[]}
    >
      <div>children</div>
    </Provider>);
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: {
          count: 11,
        }
      }
    };
    await instance.fetch('home');
    instance.request(action);
    const newData = client.readQuery({
      query: toGQL(schema, 'home'),
      variables: wrapper.instance().query.getVairables()
    });
    expect(newData.home.count).toBe(11);
  });

  test('request without writing', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
      routes={[]}
    >
      <div>children</div>
    </Provider>);
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: {
          count: 11,
        }
      }
    };
    await instance.fetch('home');
    instance.request(action, {write: false});
    const newData = client.readQuery({
      query: toGQL(schema, 'home'),
      variables: wrapper.instance().query.getVairables()
    });
    expect(newData.home.count).toBe(10);
  });

  test('subscribe', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
      routes={[]}
    >
      <div>children</div>
    </Provider>);
    const mockCallback = jest.fn();
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: {
          count: 11,
        }
      }
    };
    await instance.fetch('home');
    const subscription = instance.subscribe('home', mockCallback);
    expect(subscription).toHaveProperty('unsubscribe');
    instance.request(action);
    return new Promise((resolver) => {
      setTimeout(resolver, 100);
    }).then(() => {
      expect(mockCallback.mock.calls[0][0]).toHaveProperty('home', expect.anything(Object));
    });
  });

  test('deploy', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      routes={[]}
      client={client}
    >
      <div>children</div>
    </Provider>);
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: {
          count: 11,
        }
      }
    };
    await instance.fetch('home');
    instance.request(action, {write: false});
    const data = await instance.deploy('home');
    expect(data).toMatchObject({updateHome: {__typename: 'HomePayload'}});
  });

  test('afterDeploy', async () => {
    const afterDeploy = jest.fn();
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
      afterDeploy={afterDeploy}
      routes={[]}
    >
      <div>children</div>
    </Provider>);
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: {
          count: 11,
        }
      }
    };
    await instance.fetch('home');
    instance.request(action, {write: false});
    await instance.deploy('home');
    expect(afterDeploy.mock.calls[0][0]).toMatchObject({
      key: 'home',
      result: {updateHome: {__typename: "HomePayload"}},
      actions: [action]
    });
  })
});
