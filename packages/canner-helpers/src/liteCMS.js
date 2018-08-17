// @flow
import * as React from 'react';
import Context from './context';

type Props = {
  [string]: any
};

export default class LiteCMS extends React.Component<Props> {
  render() {
    const {refId, ...rest} = this.props;
    return (
      <Context.Consumer>
        {value => value.renderComponent(refId, {
          ...rest
        })}
      </Context.Consumer>
    );
  }
}