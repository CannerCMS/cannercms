// @flow
import * as React from 'react';
import Context from './context';

type Props = {
  [string]: any
};

export default function LiteCMS(props: Props) {
  const { refId, ...rest } = props;
  return (
    <Context.Consumer>
      {value => value.renderComponent(refId, {
        ...rest,
      })}
    </Context.Consumer>
  );
}
