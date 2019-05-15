import React from 'react';
import {render, cleanup, fireEvent, waitForDomChange} from 'react-testing-library';
import 'jest-dom/extend-expect';
import {Context} from 'canner-helpers';
import useMethods from '../../src/hooks/useMethods';

afterEach(cleanup);

let updateTitle, newPost, Com, routes,
  request, updateQuery, deploy, rootValue,
  data, contextValue;
beforeEach(() => {
  updateTitle = jest.fn();
  newPost = {
    id: 'post1',
    title: 'new title'
  }
  Com = ({pattern}) => {
    const {rootValue, request, deploy, reset} = useMethods({pattern});
    updateTitle.mockImplementation(() => {
      const action = {
        type: 'UPDATE_ARRAY',
        payload: {
          id: 'post1',
          key: 'posts',
          path: '',
          value: newPost
        }
      };
      request(action);
    })
    return (
      <div data-testid="mock-com">
        <p data-testid="mock-content">
          {JSON.stringify(rootValue)}
        </p>
        <button data-testid="mock-update-title" onClick={updateTitle}>update title</button>
        <button data-testid="mock-deploy" onClick={() => deploy('posts')}>deploy</button>
        <button data-testid="mock-reset" onClick={() => reset('posts')}>reset</button>
      </div>
    )
  };
  routes = ['posts'];
  request = jest.fn();
  updateQuery = jest.fn();
  deploy = jest.fn();
  rootValue = [{id: 'post1', title: 'title1'}];
  data = {
    posts: {
      edges: [{cursor: 'post1', edge: {id: 'post1', title: 'title1'}}],
      pageInfo: {}
    }
  }
  contextValue = {
    routes, request, updateQuery,
    deploy, rootValue, data
  }
})

describe('useMethods', () => {
  it('should get the value from the hook and render', () => {
    const {getByTestId} = render(
      <Context.Provider value={contextValue}>
        <Com pattern="array" />
      </Context.Provider>
    );
    expect(getByTestId('mock-content')).toHaveTextContent(JSON.stringify(rootValue));
  });
});

describe('update in useMethods hook', () => {
  it('should get the new value after update the value, but not call the contextValue.request', async () => {
    const {getByTestId, container} = render(
      <Context.Provider value={contextValue}>
        <Com pattern="array" />
      </Context.Provider>
    );
    const promise = waitForDomChange({container})
      .then(() => {
        expect(getByTestId('mock-content')).toHaveTextContent(JSON.stringify(newPost));
        expect(request).toBeCalledTimes(0);
        expect(updateTitle).toBeCalledTimes(1);
      });
    fireEvent.click(getByTestId('mock-update-title'));
    await promise; 
  });

  it('should call the contextValue.request after deploy', async () => {
    const {getByTestId, container} = render(
      <Context.Provider value={contextValue}>
        <Com pattern="array" />
      </Context.Provider>
    );
    const promise = waitForDomChange({container})
      .then(() => {
        expect(getByTestId('mock-content')).toHaveTextContent(JSON.stringify(newPost));
        expect(request).toBeCalledTimes(1);
        expect(updateTitle).toBeCalledTimes(1);
      });
    fireEvent.click(getByTestId('mock-update-title'));
    fireEvent.click(getByTestId('mock-deploy'));
    await promise; 
  });

  it('should not call the contextValue.request after reset', async () => {
    const {getByTestId, container} = render(
      <Context.Provider value={contextValue}>
        <Com pattern="array" />
      </Context.Provider>
    );
    let promise = waitForDomChange({container})
      .then(() => {
        expect(getByTestId('mock-content')).toHaveTextContent(JSON.stringify(newPost));
        expect(request).toBeCalledTimes(0);
        expect(updateTitle).toBeCalledTimes(1);
      });
    fireEvent.click(getByTestId('mock-update-title'));
    await promise; 
    promise = waitForDomChange({container})
      .then(() => {
        expect(getByTestId('mock-content')).not.toHaveTextContent(JSON.stringify(newPost));
        expect(request).toBeCalledTimes(0);
      });
    fireEvent.click(getByTestId('mock-reset'));
    await promise; 
  });
});
