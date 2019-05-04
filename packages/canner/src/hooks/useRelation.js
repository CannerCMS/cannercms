// @flow
import React, {useState, useContext, useRef, useEffect} from 'react';
import {Context} from 'canner-helpers';
import gql from 'graphql-tag';
import {isEmpty} from 'lodash';
import {Icon, Spin} from 'antd';
import {Query} from '../query';
import Toolbar from '../components/toolbar/index';
import RefId from 'canner-ref-id';
import {parseConnectionToNormal} from '../hocs/utils';

export default function({
  relation = {},
  type,
  graphql,
  variables,
  fetchPolicy,
  refId,
  toolbar
}: {
  relation: any,
  type: string,
  graphql: string,
  variables: Object,
  fetchPolicy: string,
  refId: RefId,
  toolbar: Object
}) {
  const {
    schema,
    client
  } = useContext(Context);
  const isRelationComponent = !isEmpty(relation);
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState({});
  const [rootValue, setRootValue] = useState({});
  const queryRef = useRef(new Query({schema}));
  const updateRelationValue = (data: Object) => {
    const removeSelfRootValue = {[relation.to]: removeSelf(data[relation.to], refId, relation.to)};
    let parsedRootValue = removeSelfRootValue;
    const rootValue = parseConnectionToNormal(parsedRootValue);
    setData(parsedRootValue);
    setRootValue(rootValue);
    setFetching(false);
  }
  const queryData = async (): Promise<*> => {
    if (!isRelationComponent) {
      return Promise.resolve();
    }
    setFetching(true);
    if (type === 'relation' && graphql) {
      // customize query
      const {data, error, errors} = await client.query({
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
    const {data} = await client.query({
      query: gql`${gqlStr}`,
      variables: gqlVariables,
      fetchPolicy
    });
    return updateRelationValue(data);
  }
  const getArgs = () => {
    if (!relation.to) {
      return {};
    }
    return queryRef.current.getArgs(relation.to);
  }

  const updateQuery = (paths: Array<string>, args: Object) => {
    queryRef.current.updateQueries(paths, 'args', args);
    queryData();
  }

  useEffect(() => {
    queryData();
  }, [refId.toString()]);
  const relationToolbar =  isRelationComponent ? ({children, ...restProps}: any) => <Toolbar
    {...restProps}
    items={schema[relation.to].items.items}
    toolbar={toolbar || {pagination: {type: 'pagination'}}}
    args={getArgs()}
    query={queryRef.current}
    keyName={relation.to}
    refId={new RefId(relation.to)}
    originRootValue={data}
    updateQuery={updateQuery}
    rootValue={rootValue}
  >
    {/* $FlowFixMe */}
    <SpinWrapper isFetching={fetching}>
      {children}
    </SpinWrapper>
  </Toolbar> : null;
  return {
    relationToolbar,
    relationFetching: fetching,
    relationValue: data[relation.to] || {edges: []}
  }
}


export function removeSelf(value: any, refId: RefId, relationTo: string) {
  const [key, index] = refId.getPathArr().slice(0, 2);
  if (key !== relationTo) {
    return value;
  }
  return {...value, edges: value.edges.filter((v, i) => i !== Number(index))};
}

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;

function SpinWrapper({
  isFetching,
  children,
  value
}: {
  isFetching: boolean,
  children: Function,
  value: any
}): React$Element<*> {
  return (
    <Spin indicator={antIcon} spinning={isFetching}>
      {children(value)}
    </Spin>
  )
}