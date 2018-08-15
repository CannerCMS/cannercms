// @flow
import * as React from 'react';
import Context from './context';

type Props = {
  [string]: any
};

export default class CancelButton extends React.Component<Props> {
  render() {
    return (
      <Context.Consumer>
        {value => value.renderCancelButton({
          refId: value.refId,
          ...this.props
        })}
      </Context.Consumer>
    );
  }
}