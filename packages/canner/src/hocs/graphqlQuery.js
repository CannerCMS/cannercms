import * as React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

export default function withQuery(Com) {
  return class ComWithQuery extends React.Component {
    render() {
      const {graphql, getValue, ...restProps} = this.props;
      return (
        <Query query={gql`${graphql}`} >
          {({loading, error, data}) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;
            const key = Object.keys(data)[0];
            let value = data[key];
            if (Array.isArray(value)) {
              // delete symbol in every item to let vega works
              value = value.map(v => ({...v}));
            }
            if (getValue) {
              value = getValue(value);
            }
            return (
              <Com value={value} {...restProps} />
            );
          }}
        </Query>
      );
    }
  }
}