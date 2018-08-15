// @flow
import * as React from 'react';
import Context from './context';

type Props = {
  [string]: any
};

export default class ConfirmButton extends React.Component<Props> {
  render() {
    return (
      <Context.Consumer>
        {value => value.renderConfirmButton({
          refId: value.refId,
          ...this.props
        })}
      </Context.Consumer>
    );
  }
}