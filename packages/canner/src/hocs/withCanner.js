// @flow

import React, {useContext, useMemo, useCallback} from 'react';
import {Context} from 'canner-helpers';
import CannerItem from '../components/item';
import Toolbar from '../components/toolbar';

// hooks
import useRefId from '../hooks/useRefId';
import useOnChange from '../hooks/useOnChange';
import useValidation from '../hooks/useValidation';
import useOnDeploy from '../hooks/useOnDeploy';
import useFieldValue from '../hooks/useFieldValue';
import useRenderType from '../hooks/useRenderType';

export default function withCanner(Com: any) {
  return function ComWithCanner(props: any) {
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
      toolbar
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
    const myRefId = useRefId({pattern, keyName, refId});
    // const {
    //   updateRelationQuery,
    //   relationFetching,
    //   relationArgs,
    //   relationQuery,
    //   relationRefId,
    //   relationKeyName,
    //   relationRootValue,
    //   relationValue,
    //   relationOriginRootValue,
    // } = useRelation({
    //   relation,
    //   type,
    //   graphql,
    //   variables,
    //   fetchPolicy,
    //   refId
    // })
    const {renderType} = useRenderType({pattern, path, refId: myRefId});
    const {onChange} = useOnChange({rootValue, request});
    const {fieldValue} = useFieldValue({rootValue, refId: myRefId});
    const {error, errorInfo} = useValidation({
      value: fieldValue,
      refId: myRefId,
      required,
      validation
    });
    const componentOnDeploy = useOnDeploy({
      onDeploy,
      removeOnDeploy,
      refId: myRefId,
    });
    const item = (
      <CannerItem
        refId={myRefId}
        value={fieldValue}
        layout={layout}
        required={required}
        type={type}
        description={description}
        hideTitle={hideTitle}
        imageStorage={imageStorage}
        title={title}
        // relationValue={relationValue}
        onChange={onChange}
        onDeploy={componentOnDeploy.onDeploy}
        renderChildren={renderChildren}
        removeOnDeploy={componentOnDeploy.removeOnDeploy}
        renderType={renderType}
        renderConfirmButton={() => null}
        renderCancelButton={() => null}
        render={(cannerItemProps) => <Com {...props} {...contextValue} {...cannerItemProps} />}
        // external
        error={error}
        errorInfo={errorInfo}
      />
    )
    const myContextValue = {
      ...contextValue,
      refId: myRefId,
      renderChildren
    };
    const isListForm = (pattern === 'array' && routes.length === 1 && routerParams.operator === 'update');
    if (isListForm || type === 'relation') {
      const args = query.getArgs(keyName);
      return (
        <Context.Provider value={myContextValue}>
          <Toolbar
            items={items}
            toolbar={toolbar}
            args={args}
            query={query}
            refId={myRefId}
            keyName={keyName}
            originRootValue={data}
            rootValue={rootValue}
            updateQuery={updateQuery}
            request={request}
            deploy={deploy}
            // items={items}
            // toolbar={toolbar}
            // args={type === 'relation' ? relationArgs : args}
            // query={type === 'relation' ? relationQuery: query}
            // refId={type === 'relation' ? relationRefId : refId}
            // keyName={type === 'relation' ? relationKeyName: keyName}
            // originRootValue={type === 'relation' ? relationOriginRootValue : data}
            // rootValue={type === 'relation' ? relationRootValue: rootValue}
            // updateQuery={type === 'relation' ? updateRelationQuery : updateQuery}
            // request={request}
            // deploy={deploy}
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
  }
}
