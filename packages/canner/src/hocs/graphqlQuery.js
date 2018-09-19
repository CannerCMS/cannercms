import * as React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {List} from 'react-content-loader';

export default function withQuery(Com) {
  return class ComWithQuery extends React.Component {
    render() {
      const {graphql, variables, getValue, ...restProps} = this.props;
      return (
        <Query query={gql`${graphql}`} variables={variables}>
          {({loading, error, data, ...graphqlProps}) => {
            if (loading) return <List style={{maxWidth: '600px'}}/>;
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
              <Com value={value} {...restProps} {...graphqlProps} />
            );
          }}
        </Query>
      );
    }
  }
}