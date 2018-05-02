import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
// import toJson from 'enzyme-to-json';
import Adapter from '../react163Adapter';
import {schema, defaultData} from './data';
import Provider from '../../src/components/Provider';
// import {HOCContext as Context} from '../../src/hocs/context';
import {createClient} from '@canner/graphql-resolver';
import {schemaToQueriesObject, objectToQueries} from '../../src/query/utils';
import {fromJS} from 'immutable';
import gql from "graphql-tag";
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
Enzyme.configure({ adapter: new Adapter() });


function toGQL(schema, key) {
  return gql`${objectToQueries(pick(schemaToQueriesObject(schema), key))}`
}

describe('provider methods', () => {
  let client;
  beforeEach(() => {
    client = createClient({
      schema: mapValues(schema, v => {
        if (v.type === 'array') {
          return {
            type: 'array',
            items: v.items.items
          };
        }
        return v;
      }),
      defaultData
    })
  });

  test('fetch object', () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
    >
      <div>children</div>
    </Provider>);
    return wrapper.instance().fetch('home').then(d => {
      expect(d.data).toMatchSnapshot();
    })
  });

  test('fetch array', () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
    >
      <div>children</div>
    </Provider>)
    return wrapper.instance().fetch('posts').then(d => {
      expect(d.data).toMatchSnapshot();
    })
  });

  test('updateQuery', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
    >
      <div>children</div>
    </Provider>)
    const originData = await wrapper.instance().fetch('posts');
    wrapper.instance().updateQuery('posts', {where: {author: {name: "user2"}}});
    const newData = await wrapper.instance().fetch('posts');
    expect(originData).not.toEqual(newData);
  });

  test('request', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
    >
      <div>children</div>
    </Provider>);
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: fromJS({
          count: 11,
        })
      }
    };
    await instance.fetch('home');
    instance.request(action);
    const newData = client.readQuery({
      query: toGQL(schema, 'home')
    });
    expect(newData.home.count).toBe(11);
  });

  test('request without writing', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
    >
      <div>children</div>
    </Provider>);
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: fromJS({
          count: 11,
        })
      }
    };
    await instance.fetch('home');
    instance.request(action, {write: false});
    const newData = client.readQuery({
      query: toGQL(schema, 'home')
    });
    expect(newData.home.count).toBe(10);
  });

  test('subscribe', async () => {
    const wrapper = shallow(<Provider
      schema={schema}
      client={client}
    >
      <div>children</div>
    </Provider>);
    const mockCallback = jest.fn();
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: fromJS({
          count: 11,
        })
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
      client={client}
    >
      <div>children</div>
    </Provider>);
    const instance = wrapper.instance();
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'home',
        value: fromJS({
          count: 11,
        })
      }
    };
    await instance.fetch('home');
    instance.request(action, {write: false});
    await expect(instance.deploy('home')).resolves.toMatchObject({updateHome: {count: 11}});
    // const newData = client.readQuery({
    //   query: toGQL(schema, 'home')
    // });
    // expect(newData).toMatchObject({home: {
    //   count: 11
    // }});
  });
});