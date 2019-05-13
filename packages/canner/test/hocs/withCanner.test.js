import React from 'react';
import {render, cleanup} from 'react-testing-library';
import 'jest-dom/extend-expect';
import RefId from 'canner-ref-id';
import withCanner from '../../src/hocs/withCanner';
import {Context} from 'canner-helpers';
afterEach(cleanup);

describe('withCanner', () => {
  it('should render', async () => {
    // com
    let Com = () => <div data-testid="mock-com">mock-com</div>;
    let ComWithCanner = withCanner(Com);
    // props
    let renderChildren = () => <div data-test-id="mock-children">mock-children</div>;
    let pattern = 'array';
    let keyName = 'posts';
    let type = 'array';
    let required = false;
    let validation = undefined;
    let layout = undefined;
    let description = 'description';
    let title = 'title';
    let path = 'posts';
    let hideTitle = false;
    let refId = new RefId('posts');
    let items = {type: 'object', items: {title: {type: 'string'}}};
    let toolbar = {};
    let graphql = undefined;
    let variables = undefined;
    let fetchPolicy = undefined;
    let relation = undefined;
    let controlDeployAndResetButtons = undefined;
    let hideButtons = undefined;
    // contextValue
    let rootValue = {[keyName]: []};
    let request = jest.fn().mockResolvedValue();
    let imageStorage = {upload: jest.fn().mockResolvedValue()};
    let onDeploy = jest.fn();
    let removeOnDeploy = jest.fn();
    let deploy = jest.fn().mockResolvedValue();
    let data = {[keyName]: []};
    let updateQuery = jest.fn().mockResolvedValue();
    let query = jest.fn().mockResolvedValue();
    let routes = [keyName];
    let routerParams = {};
    let reset = jest.fn().mockResolvedValue();
    const {getByTestId} = render(
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
        reset 
      }}>
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
      </Context.Provider>
    );
    expect(getByTestId('mock-com')).toHaveTextContent('mock-com');
  });
})