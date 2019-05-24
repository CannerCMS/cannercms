import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { createClient, MemoryConnector } from 'canner-graphql-interface';
import { schema, defaultData } from './data';
import Provider from '../../src/components/Provider';
// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('provider methods', () => {
  let client;
  beforeEach(() => {
    client = createClient({
      schema,
      connector: new MemoryConnector({
        defaultData,
      }),
    });
  });

  test('fetch object', async () => {
    const { getByTestId } = render(
      <Provider
        schema={schema}
        client={client}
        routes={[]}
      >
        <div data-testid="children">children</div>
      </Provider>
    );
    expect(getByTestId('children')).toHaveTextContent('children');
  });
  // TODO: test actions
});
