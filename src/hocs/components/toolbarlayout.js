// @flow

import * as React from 'react';

type Props = {
  Sort: React.Node,
  Filter: React.Node,
  Pagination: React.Node,
  children: React.Node,
}

export default class ToolbarLayout extends React.PureComponent<Props> {
  render() {
    const {Filter, Sort, children, Pagination} = this.props;
    return (
      <React.Fragment>
        {Filter}
        {Sort}
        {React.Children.only(children)}
        {Pagination}
      </React.Fragment>
    );
  }
}

