import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import RefId from 'canner-ref-id';
import { Context } from 'canner-helpers';
import withCanner from '../../src/hocs/withCanner';

afterEach(cleanup);

describe('withCanner', () => {
  it('should render', async () => {
    // com
    const Com = () => <div data-testid="mock-com">mock-com</div>;
    const ComWithCanner = withCanner(Com);
    // props
    const renderChildren = () => <div data-test-id="mock-children">mock-children</div>;
    const pattern = 'array';
    const keyName = 'posts';
    const type = 'array';
    const required = false;
    const validation = undefined;
    const layout = null;
    const description = 'description';
    const title = 'title';
    const path = 'posts';
    const hideTitle = false;
    const refId = new RefId('posts');
    const items = { type: 'object', items: { title: { type: 'string' } } };
    const toolbar = {};
    const graphql = null;
    const variables = null;
    const fetchPolicy = null;
    const relation = {};
    const controlDeployAndResetButtons = null;
    const hideButtons = null;
    // contextValue
    const rootValue = { [keyName]: [] };
    const request = jest.fn().mockResolvedValue();
    const imageStorage = { upload: jest.fn().mockResolvedValue() };
    const onDeploy = jest.fn();
    const removeOnDeploy = jest.fn();
    const deploy = jest.fn().mockResolvedValue();
    const data = { [keyName]: [] };
    const updateQuery = jest.fn().mockResolvedValue();
    const query = jest.fn().mockResolvedValue();
    const routes = [keyName];
    const routerParams = {};
    const reset = jest.fn().mockResolvedValue();
    const { getByTestId } = render(
      <Context.Provider value={{
        rootValue,
        request,
        imageStorage,
        onDeploy,
        removeOnDeploy,
        deploy,
        data,
        updateQuery,
        query,
        routes,
        routerParams,
        reset,
      }}
      >
        <ComWithCanner
          pattern={pattern}
          keyName={keyName}
          type={type}
          required={required}
          validation={validation}
          layout={layout}
          description={description}
          title={title}
          path={path}
          hideTitle={hideTitle}
          refId={refId}
          renderChildren={renderChildren}
          items={items}
          toolbar={toolbar}
          graphql={graphql}
          variables={variables}
          fetchPolicy={fetchPolicy}
          relation={relation}
          controlDeployAndResetButtons={controlDeployAndResetButtons}
          hideButtons={hideButtons}
        />
      </Context.Provider>,
    );
    expect(getByTestId('mock-com')).toHaveTextContent('mock-com');
  });
});
