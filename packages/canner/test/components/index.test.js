import React from 'react';
import { render, cleanup, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { createClient, MemoryConnector } from 'canner-graphql-interface';
import { Item } from 'canner-helpers';
import Canner from '../../src/components';
import { defaultData } from './data';
// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

function MockPosts() {
  return (
    <div data-testid="mock-posts">
      <Item />
    </div>
  );
}

function MockInfo() {
  return (
    <div data-testid="mock-info">
      <Item />
    </div>
  );
}

function MockComponnet() {
  return (
    <div data-testid="mock-component">
      <Item />
    </div>
  );
}

const schema = {
  schema: {
    posts: {
      type: 'array',
      items: {
        type: 'object',
        items: {
          title: {
            type: 'string',
            loader: new Promise(resolve => resolve(MockComponnet)),
          },
        },
      },
      toolbar: {
        pagination: true,
      },
      keyName: 'posts',
      loader: new Promise(resolve => resolve(MockPosts)),
    },
    info: {
      type: 'object',
      items: {
        name: {
          type: 'string',
          loader: new Promise(resolve => resolve(MockComponnet)),
        },
      },
      keyName: 'info',
      component: MockInfo,
      loader: new Promise(resolve => resolve(MockInfo)),
    },
  },
  visitors: [],
  fileStorages: {},
  imageStorages: {},
  pageSchema: {},
  dict: {},
};


describe('<Canner>', () => {
  let client;
  beforeEach(() => {
    client = createClient({
      schema: schema.schema,
      connector: new MemoryConnector({
        defaultData,
      }),
    });
  });

  test('Should render', async () => {
    const { getByTestId } = render(
      <Canner
        client={client}
        schema={schema}
        routes={['posts']}
        goTo={() => {}}
        routerParams={{}}
      />,
    );
    const posts = await waitForElement(() => getByTestId('mock-posts'));
    expect(posts).toBeInTheDocument();
  });

  test('Should change UI when routes change', async () => {
    const { getByTestId, rerender } = render(
      <Canner
        client={client}
        schema={schema}
        routes={['posts']}
        goTo={() => {}}
        routerParams={{}}
      />,
    );
    await waitForElement(() => getByTestId('mock-posts'));
    rerender(
      <Canner
        client={client}
        schema={schema}
        routes={['info']}
        goTo={() => {}}
        routerParams={{}}
      />,
    );
    const info = await waitForElement(() => getByTestId('mock-info'));
    expect(info).toBeInTheDocument();
  });

  test('Should render children when create form', async () => {
    const { queryByTestId } = render(
      <Canner
        client={client}
        schema={schema}
        routes={['posts']}
        goTo={() => {}}
        routerParams={{
          operator: 'create',
        }}
      />,
    );
    const com = await waitForElement(() => queryByTestId('mock-component'));
    const posts = queryByTestId('mock-posts');
    expect(posts).not.toBeInTheDocument();
    expect(com).toBeInTheDocument();
  });
});
