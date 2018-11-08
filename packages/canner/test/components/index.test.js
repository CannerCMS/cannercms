import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Canner from '../../src/components';

function MockPosts({renderChildren, refId}) {
  return (
    <div className="posts">
      {renderChildren({refId})}
    </div>
  )
}

function MockInfo({renderChildren, refId}) {
  return (
    <div className="info">
      {renderChildren({refId})}
    </div>
  )
}

function MockComponnet() {
  return (
    <div className="component"></div>
  );
}

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  schema: {
    posts: {
      type: 'array',
      items: {
        type: 'object',
        items: {
          title: {
            type: 'string',
            loader: new Promise(resolve => resolve(MockComponnet))
          }
        }
      },
      toolbar: {
        pagination: true
      },
      keyName: 'posts',
      loader: new Promise(resolve => resolve(MockPosts))
    },
    info: {
      type: 'object',
      items: {
        name: {
          type: 'string',
          loader: new Promise(resolve => resolve(MockComponnet))
        }
      },
      keyName: 'info',
      component: MockInfo,
      loader: new Promise(resolve => resolve(MockInfo))
    }
  },
  visitors: []
}



describe('<Canner>', () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = mount(
      <Canner
        schema={schema}
        routes={['posts']}
      />
    );
    // waiting the async fetching
    await wait();
  });

  test('Should render', async () => {
    const render = wrapper.render();
    expect(render.find('.component').length).toBe(1);
    expect(render.find('.posts').length).toBe(1);
    expect(render.find('.info').length).toBe(0);
  });

  test('Should change UI when routes change', async () => {
    wrapper.setProps({
      schema,
      routes: ['info']
    });
    await wait();
    const render = wrapper.render();
    expect(render.find('.component').length).toBe(1);
    expect(render.find('.posts').length).toBe(0);
    expect(render.find('.info').length).toBe(1);
  });

  test('Should render children when create form', async () => {
    wrapper.setProps({
      schema,
      routes: ['posts'],
      routerParams: {
        operator: 'create'
      }
    });
    await wait();
    const render = wrapper.render();
    expect(render.find('.component').length).toBe(1);
    expect(render.find('.posts').length).toBe(0);
    expect(render.find('.info').length).toBe(0);
  });
})


async function wait(ms = 300) {
  await new Promise(resolve => setTimeout(resolve, ms));  
}