import * as React from 'react';
import {render, cleanup, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect';
import {schema, defaultData, getAuthorById} from './data';
import Provider from '../../src/components/Provider';
import {createClient, MemoryConnector} from 'canner-graphql-interface';
import {Query} from '../../src/query';
import gql from "graphql-tag";
// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);


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

  test('fetch object', async () => {
    const {getByTestId} = render(<Provider
      schema={schema}
      client={client}
      routes={[]}
    >
      <div data-testid="children">children</div>
    </Provider>);
    expect(getByTestId('children')).toHaveTextContent('children');
  });
  // TODO: test actions
});
