// @flow
import {useState, useContext, useRef, useEffect} from 'react';
import {Context} from 'canner-helpers';
import gql from 'graphql-tag';
import {mapValues} from 'lodash';
import {Query} from '../query';
import RefId from 'canner-ref-id';

export default function({
  relation,
  type,
  graphql,
  variables,
  fetchPolicy,
  refId
}: {
  relation: any,
  type: string,
  graphql: string,
  variables: Object,
  fetchPolicy: string,
  refId: RefId
}) {
  const {
    schema,
    client
  } = useContext(Context);
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState({});
  const [rootValue, setRootValue] = useState({});
  const queryRef = useRef(new Query({schema}));
  const updateRelationValue = (data: Object, rootValue: any) => {
    setData(data);
    setRootValue(rootValue);
    setFetching(false);
  }
  const queryData = async (): Promise<*> => {
    if (!relation) {
      return Promise.resolve();
    }
    setFetching(true);
    if (type === 'relation' && graphql) {
      // customize query
      const {data, error, errors} = client.query({
        query: gql`${graphql}`,
        variables: variables || queryRef.current.getVariables(),
        fetchPolicy
      });
      if (error) {
        throw new Error(errors);
      }
      return updateRelationValue(data);
    }
    const gqlStr = queryRef.current.toGQL(relation.to);
    const gqlVariables = queryRef.current.getVariables();
    const {data} = client.query({
      query: gql`${gqlStr}`,
      variables: gqlVariables,
      fetchPolicy
    });
    return updateRelationValue(data);
  }
  const getArgs = () => {
    const queries = queryRef.current.getQueries([relation.to]).args || {pagination: {first: 10}};
    const variables = queryRef.current.getVariables();
    const args = mapValues(queries, v => variables[v.substr(1)]);
    return args;
  }

  const updateQuery = (paths: Array<string>, args: Object) => {
    queryRef.current.updateQueries(paths, 'args', args);
    queryData();
  }

  useEffect(() => {
    queryData();
  }, [refId.toString()]);


  return {
    updateRelationQuery: updateQuery,
    relationFetching: fetching,
    relationArgs: getArgs(),
    relationQuery: queryRef.current,
    relationRefId: new RefId(relation && relation.to),
    relationKeyName: relation && relation.to,
    relationRootValue: rootValue,
    relationOriginRootValue: data,
    relationValue: data[relation && relation.to]
  }
}