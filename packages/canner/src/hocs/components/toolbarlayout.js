// @flow

import * as React from 'react';

type Props = {
  Sort: React.Node,
  Filter: React.Node,
  Pagination: React.Node,
  children: React.Node,
  Actions: React.Node,
}

export default class ToolbarLayout extends React.PureComponent<Props> {
  render() {
    const {Filter, Sort, Actions, children, Pagination} = this.props;
    return (
      
      <React.Fragment>
        <div style={{
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {Actions}
            {Sort}
          </div>
          <div style={{
            marginTop: 16,
            display: 'flex',
            flexWrap: 'wrap'
          }}>
            {Filter}
          </div>
        </div>
        {React.Children.only(children)}
        {Pagination}
      </React.Fragment>
    );
  }
}

