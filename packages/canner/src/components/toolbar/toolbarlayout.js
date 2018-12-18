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
          flexWrap: 'wrap',
        }}>
          {
            Actions || Sort ? (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '8px 0 16px 0',
              }}>
                {Actions || <div />}
                {Sort}
              </div>
            ) : null
          }
          {
            Filter ? (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                margin: Filter ? '0 0 16px 0' : '',
              }}>
                {Filter}
              </div>
            ) : null
          }
        </div>
        {React.Children.only(children)}
        {Pagination}
      </React.Fragment>
    );
  }
}

