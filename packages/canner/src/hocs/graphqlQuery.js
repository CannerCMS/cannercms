import * as React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

export default function withQuery(Com) {
  return class ComWithQuery extends React.Component {
    render() {
      const {graphql, ...restProps} = this.props;
      return (
        <Query query={gql`${graphql}`} >
          {({loading, error, data}) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;
            const key = Object.keys(data)[0];
            return (
              <Com value={data[key].map(d => ({...d}))} {...restProps} />
            );
          }}
        </Query>
      );
    }
  }
}