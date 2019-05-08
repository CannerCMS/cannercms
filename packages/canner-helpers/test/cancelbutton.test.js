import * as React from 'react';
import {ResetButton, Context} from '../src';
import {render, cleanup, fireEvent} from 'react-testing-library';
import RefId from 'canner-ref-id';
import 'jest-dom/extend-expect';
afterEach(cleanup);


describe('confirm button', () => {
  let context;

  beforeEach(() => {
    context = {
      refId: new RefId('refId'),
      reset: jest.fn().mockResolvedValue()
    };
  });

  it('should render, default refId', () => {
    const {getByTestId} = render(
      <Context.Provider value={context}>
        <ResetButton />
      </Context.Provider>
    );
    expect(getByTestId('reset-button')).toHaveTextContent('Cancel');
  });

  it('should execute reset with key', () => {
    const {getByTestId} = render(<Context.Provider value={context}>
      <ResetButton />
    </Context.Provider>);
    fireEvent.click(getByTestId('reset-button'));
    expect(context.reset).toHaveBeenCalledWith(context.refId.getPathArr()[0]);
  });
});