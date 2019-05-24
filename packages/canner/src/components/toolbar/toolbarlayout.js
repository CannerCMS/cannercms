// @flow

import * as React from 'react';

export default (React.memo: any)(({
  Filter, Sort, Actions, children, Pagination,
}) => (
  <React.Fragment>
    <div style={{
      flexWrap: 'wrap',
    }}
    >
      {
          Actions || Sort ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '8px 0 16px 0',
            }}
            >
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
            }}
            >
              {Filter}
            </div>
          ) : null
        }
    </div>
    {children}
    {Pagination}
  </React.Fragment>
));
