// @flow

import React, { useContext, useMemo } from 'react';
import { Context } from 'canner-helpers';
import { isEqual, isFunction } from 'lodash';
import CannerItem from '../components/item';
import Toolbar from '../components/toolbar';

// hooks
import useRefId from '../hooks/useRefId';
import useOnChange from '../hooks/useOnChange';
import useValidation from '../hooks/useValidation';
import useRelation from '../hooks/useRelation';
import useOnDeploy from '../hooks/useOnDeploy';
import useFieldValue from '../hooks/useFieldValue';
import useRenderType from '../hooks/useRenderType';

export default function withCanner(Com: any) {
  return (React.memo: any)((props: any) => {
    const {
      pattern,
      keyName,
      type,
      required,
      validation,
      layout,
      description,
      title,
      path,
      hideTitle,
      refId,
      renderChildren,
      items,
      toolbar,
      graphql,
      variables,
      fetchPolicy,
      relation,
      nodeType
    } = props;
    const contextValue = useContext(Context);
    const {
      rootValue,
      request,
      imageStorage,
      onDeploy,
      removeOnDeploy,
      deploy,
      data,
      updateQuery,
      query,
      routes,
      routerParams,
    } = contextValue;
    const myRefId = useRefId({
      nodeType, pattern, keyName, refId
    });
    const {
      relationToolbar,
      relationValue,
      relationFetching,
    } = useRelation({
      relation,
      toolbar,
      type,
      graphql,
      variables,
      fetchPolicy,
      refId: myRefId,
    });
    const { renderType } = useRenderType({ pattern, path, refId: myRefId });
    const { onChange } = useOnChange({ rootValue, request });
    const { fieldValue } = useFieldValue({ rootValue, refId: myRefId });
    const { error, errorInfo } = useValidation({
      value: fieldValue,
      refId: myRefId,
      required,
      validation,
    });
    const componentOnDeploy = useOnDeploy({
      onDeploy,
      removeOnDeploy,
      refId: myRefId,
    });

    const item = (
      <CannerItem
        data-testid={props['data-testid']}
        refId={myRefId}
        value={fieldValue}
        layout={layout}
        required={required}
        relationFetching={relationFetching}
        type={type}
        items={items}
        description={description}
        hideTitle={hideTitle}
        imageStorage={imageStorage}
        title={title}
        Toolbar={relationToolbar}
        relationValue={relationValue}
        onChange={onChange}
        onDeploy={componentOnDeploy.onDeploy}
        renderChildren={renderChildren}
        removeOnDeploy={componentOnDeploy.removeOnDeploy}
        renderType={renderType}
        render={cannerItemProps => <Com {...props} {...contextValue} {...cannerItemProps} />}
        // external
        error={error}
        errorInfo={errorInfo}
      />
    );
    const myContextValue = useMemo(() => ({
      ...contextValue,
      refId: myRefId,
      renderChildren,
    }), [myRefId.toString(), fieldValue]);
    const isListForm = (pattern === 'array' && routes.length === 1 && routerParams.operator === 'update');
    if (isListForm) {
      return (
        <Context.Provider value={myContextValue}>
          <Toolbar
            items={items}
            toolbar={toolbar}
            args={query.getArgs(keyName)}
            query={query}
            refId={myRefId}
            keyName={keyName}
            originRootValue={data}
            rootValue={rootValue}
            updateQuery={updateQuery}
            request={request}
            deploy={deploy}
          >
            {item}
          </Toolbar>
        </Context.Provider>
      );
    }
    return (
      <Context.Provider value={myContextValue}>
        {item}
      </Context.Provider>
    );
  }, (prevProps, nextProps) => Object.entries(nextProps).reduce((eq, [k, v]: any) => {
    if (isFunction(v)) {
      return eq;
    }
    if (k === 'refId') {
      return eq && prevProps[k].toString() === v.toString();
    }
    return isEqual(v, prevProps[k]) && eq;
  }, true));
}
