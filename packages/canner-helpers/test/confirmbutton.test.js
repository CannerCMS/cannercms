import * as React from 'react';
import {ConfirmButton, Context} from '../src';
import {render, cleanup, fireEvent} from 'react-testing-library';
import RefId from 'canner-ref-id';
import 'jest-dom/extend-expect';
afterEach(cleanup);


describe('confirm button', () => {
  let context;

  beforeEach(() => {
    context = {
      refId: new RefId('refId'),
      deploy: jest.fn().mockResolvedValue()
    };
  });

  it('should render, default refId', () => {
    const {getByTestId} = render(
      <Context.Provider value={context}>
        <ConfirmButton />
      </Context.Provider>
    );
    expect(getByTestId('confirm-button')).toHaveTextContent('Submit');
  });

  it('should execute deploy with key', () => {
    const {getByTestId} = render(<Context.Provider value={context}>
      <ConfirmButton />
    </Context.Provider>);
    fireEvent.click(getByTestId('confirm-button'));
    expect(context.deploy).toHaveBeenCalledWith(context.refId.getPathArr()[0]);
  });
});