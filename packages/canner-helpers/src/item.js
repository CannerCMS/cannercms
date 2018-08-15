// @flow
import * as React from 'react';
import Context from './context';

type Props = {
  [string]: any
};

export default class Item extends React.Component<Props> {
  render() {
    const {filter, ...rest} = this.props;
    return (
      <Context.Consumer>
        {value => value.renderChildren(
          filter ? 
            node => ({refId: value.refId, routes: value.routes, hidden: !filter(node), ...rest}):
            {
              refId: value.refId,
              routes: value.routes,
              ...rest
            }
        )}
      </Context.Consumer>
    );
  }
}