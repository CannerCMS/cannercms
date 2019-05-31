// @flow
import React, {
  useRef, useEffect, useReducer, useCallback, useMemo
} from 'react';
import gql from 'graphql-tag';
import { isEmpty } from 'lodash';
import { Icon, Spin } from 'antd';
import RefId from 'canner-ref-id';
import { Query } from '../query';
import Toolbar from '../components/toolbar/index';
import { parseConnectionToNormal } from '../hocs/utils';

export default function ({
  relation = {},
  type,
  graphql,
  variables,
  fetchPolicy,
  refId,
  toolbar,
  schema,
  client
}: {
  relation: any,
  type: string,
  graphql: string,
  variables: Object,
  fetchPolicy: string,
  refId: RefId,
  toolbar: Object,
  schema: any,
  client: any
}) {
  const isRelationComponent = !isEmpty(relation);
  const [state, dispatch] = useReducer(reducer, {
    fetching: false,
    data: {},
    rootValue: {}
  });
  const queryRef = useRef(new Query({ schema }));
  const relationTo = relation.to;
  const customizedQueryData = useCallback(async () => {
    const { data, error, errors } = await client.query({
      query: gql`${graphql}`,
      variables: variables || queryRef.current.getVariables(),
      fetchPolicy,
    });
    if (error) {
      throw new Error(errors);
    }
    return dispatch({
      type: 'fetched',
      payload: {
        data,
        relationTo,
        refId
      }
    });
  }, [dispatch, client, graphql, variables, relationTo, refId]);
  const defaultQueryData = useCallback(async () => {
    const gqlStr = queryRef.current.toGQL(relationTo);
    const gqlVariables = queryRef.current.getVariables();
    const { data } = await client.query({
      query: gql`${gqlStr}`,
      variables: gqlVariables,
      fetchPolicy,
    });
    return dispatch({
      type: 'fetched',
      payload: {
        data,
        relationTo,
        refId
      }
    });
  }, [client, fetchPolicy, relation, refId]);
  const queryData = useCallback(() => {
    if (!isRelationComponent) {
      return Promise.resolve();
    }
    dispatch({
      type: 'isFetching'
    });
    if (type === 'relation' && graphql) {
      // customize query
      customizedQueryData();
    }
    defaultQueryData();
  }, [isRelationComponent, customizedQueryData, defaultQueryData]);
  let args = {};
  if (relationTo) {
    args = queryRef.current.getArgs(relationTo);
  }

  const updateQuery = useCallback((paths: Array<string>, args: Object) => {
    queryRef.current.updateQueries(paths, 'args', args);
    queryData();
  }, [queryData]);

  useEffect(() => {
    queryData();
  }, [queryData]);
  const relationToolbar = useMemo(() => {
    if (isRelationComponent) {
      return ({ children, ...restProps }: any) => (
        <Toolbar
          {...restProps}
          items={schema[relationTo].items.items}
          toolbar={toolbar || { pagination: { type: 'pagination' } }}
          args={args}
          query={queryRef.current}
          keyName={relationTo}
          refId={new RefId(relationTo)}
          originRootValue={state.data}
          updateQuery={updateQuery}
          rootValue={state.rootValue}
        >
          {/* $FlowFixMe */}
          <SpinWrapper isFetching={state.fetching}>
            {children}
          </SpinWrapper>
        </Toolbar>
      );
    }
    return null;
  }, [isRelationComponent, schema, relationTo, toolbar, args, state.data, updateQuery, state.rootValue]);
  return {
    relationToolbar,
    relationFetching: state.fetching,
    relationValue: state.data[relation.to] || { edges: [] },
  };
}


export function removeSelf(value: any, refId: RefId, relationTo: string) {
  const [key, index] = refId.getPathArr().slice(0, 2);
  if (key !== relationTo) {
    return value;
  }
  return { ...value, edges: value.edges.filter((v, i) => i !== Number(index)) };
}

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

function SpinWrapper({
  isFetching,
  children,
  value,
}: {
  isFetching: boolean,
  children: Function,
  value: any
}): React$Element<*> {
  return (
    <Spin indicator={antIcon} spinning={isFetching}>
      {children(value)}
    </Spin>
  );
}

type State = {
  data: Object;
  rootValue: Object;
  fetching: boolean;
}

type Action = {
  type: 'isFetching'
} | {
  type: 'fetched',
  payload: any
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'fetched': {
      const {
        relationTo,
        data,
        refId
      } = action.payload;
      const removeSelfRootValue = { [relationTo]: removeSelf(data[relationTo], refId, relationTo) };
      const parsedRootValue = removeSelfRootValue;
      const rootValue = parseConnectionToNormal(parsedRootValue);
      return {
        data: parsedRootValue,
        rootValue,
        fetching: false
      };
    }
    case 'isFetching': {
      return { ...state, fetching: true };
    }
    default:
      return state;
  }
}
