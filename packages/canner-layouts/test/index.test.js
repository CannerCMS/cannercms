import React from 'react';
import { IntlProvider } from 'react-intl';
import { cleanup, render } from 'react-testing-library';
import 'jest-dom/extend-expect';

import { Context } from 'canner-helpers';
import { FORM_TYPE } from 'canner/src/hooks/useFormType';
import cannerLocales from 'canner/src/components/locale';
import Body from '../src/Body';

afterEach(cleanup);

const CannerHelperContext = ({ children }) => (
  <IntlProvider
    locale="en"
    messages={{
      ...cannerLocales.en
    }}
  >
    {children}
  </IntlProvider>
);

const keyName = 'posts';
const renderChildren = () => 'renderChildren';
const routes = [keyName];
const schema = {
  posts: {
    keyName: 'posts',
    path: 'posts',
    title: 'Posts',
    type: 'array',
    items: {}
  },
  categories: {
    keyName: 'categories',
    path: 'categories',
    title: 'Categories',
    type: 'object',
    items: {}
  }
};

function CustomizedCreateComponent() {
  return <div data-testid="customized-create-body">This is component.</div>;
}
function CustomizedListComponent() {
  return <div data-testid="customized-list-body">This is component.</div>;
}
function CustomizedUpdateComponent() {
  return <div data-testid="customized-update-body">This is component.</div>;
}


describe('canner-layouts', () => {
  describe('if formType is LIST', () => {
    it('Should render <DefaultListBody />', () => {
      const { getByTestId } = render(
        <Context.Provider
          value={{
            formType: FORM_TYPE.LIST,
            renderChildren
          }}
        >
          <Body
            routes={routes}
            schema={schema}
          />
        </Context.Provider>
      );

      expect(getByTestId('list-body')).toBeInTheDocument();
      const backButtonElement = document.querySelector('back-button');
      const confirmButtonElement = document.querySelector('confirm-button');
      const resetButtonElement = document.querySelector('reset-button');
      expect(backButtonElement).not.toBeInTheDocument();
      expect(confirmButtonElement).not.toBeInTheDocument();
      expect(resetButtonElement).not.toBeInTheDocument();
    });

    it('Should render for specifying the listComponent props', () => {
      const { getByTestId } = render(
        <Context.Provider
          value={{
            formType: FORM_TYPE.LIST,
            renderChildren
          }}
        >
          <Body
            routes={[]}
            listComponent={CustomizedListComponent}
          />
        </Context.Provider>
      );

      expect(getByTestId('customized-list-body')).toBeInTheDocument();
    });
  });

  describe('if formType is CREATE', () => {
    it('Should render <DefaultCreateBody />', () => {
      const { getByTestId } = render(
        <CannerHelperContext>
          <Context.Provider
            value={{
              formType: FORM_TYPE.CREATE,
              renderChildren
            }}
          >
            <Body
              routes={routes}
              schema={schema}
            />
          </Context.Provider>
        </CannerHelperContext>
      );

      expect(getByTestId('create-body')).toBeInTheDocument();
      expect(getByTestId('back-button')).toHaveTextContent('Back');
      expect(getByTestId('confirm-button')).toHaveTextContent('Submit');
      expect(getByTestId('reset-button')).toHaveTextContent('Cancel');
    });

    it('Should render for specifying the createComponent props', () => {
      const { getByTestId } = render(
        <CannerHelperContext>
          <Context.Provider
            value={{
              formType: FORM_TYPE.CREATE,
              renderChildren
            }}
          >
            <Body
              routes={[]}
              createComponent={CustomizedCreateComponent}
            />
          </Context.Provider>
        </CannerHelperContext>
      );

      expect(getByTestId('customized-create-body')).toBeInTheDocument();
    });
  });

  describe('if formType is UPDATE', () => {
    it('Should render <DefaultUpdateBody /> with array type', () => {
      const { getByTestId } = render(
        <CannerHelperContext>
          <Context.Provider
            value={{
              formType: FORM_TYPE.UPDATE,
              renderChildren
            }}
          >
            <Body
              routes={routes}
              schema={schema}
            />
          </Context.Provider>
        </CannerHelperContext>
      );

      expect(getByTestId('update-body')).toBeInTheDocument();
      expect(getByTestId('back-button')).toHaveTextContent('Back');
      expect(getByTestId('confirm-button')).toHaveTextContent('Submit');
      expect(getByTestId('reset-button')).toHaveTextContent('Cancel');
    });

    it('Should render <DefaultUpdateBody /> with object type', () => {
      const { getByTestId } = render(
        <CannerHelperContext>
          <Context.Provider
            value={{
              formType: FORM_TYPE.UPDATE,
              renderChildren
            }}
          >
            <Body
              routes={['categories']}
              schema={schema}
            />
          </Context.Provider>
        </CannerHelperContext>
      );

      expect(getByTestId('update-body')).toBeInTheDocument();
      expect(getByTestId('back-button')).toHaveTextContent('Back');
      expect(getByTestId('confirm-button')).toHaveTextContent('Submit');
      expect(getByTestId('reset-button')).toHaveTextContent('Reset');
    });

    it('Should render for specifying the updateComponent props', () => {
      const { getByTestId } = render(
        <CannerHelperContext>
          <Context.Provider
            value={{
              formType: FORM_TYPE.UPDATE,
              renderChildren
            }}
          >
            <Body
              routes={[]}
              updateComponent={CustomizedUpdateComponent}
            />
          </Context.Provider>
        </CannerHelperContext>
      );

      expect(getByTestId('customized-update-body')).toBeInTheDocument();
    });
  });
});
