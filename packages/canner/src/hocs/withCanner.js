// @flow

import React, {useContext} from 'react';
import {Context} from 'canner-helpers';
import CannerItem from '../components/item';
import Toolbar from '../components/toolbar';

// hooks
import useRefId from '../hooks/useRefId';
import useMethods from '../hooks/useMethods';
import useFetch from '../hooks/useFetch';
import useRenderType from '../hooks/useRenderType';
import useRelation from '../hooks/useRelation';
import useOnChange from '../hooks/useOnChange';
import useButtons from '../hooks/useButtons';
import useValidation from '../hooks/useValidation';
import useOnDeploy from '../hooks/useOnDeploy';

export default function withCanner(Com: any) {
  return function(props: any) {
    const {
      pattern,
      keyName,
      path,
      type,
      relation,
      hideBackButton,
      graphql,
      variables,
      fetchPolicy,
      controlDeployAndResetButtons,
      hideButtons,
      required,
      validation,
      layout,
      toolbar,
      items,
      description,
      title,
      hideTitle
    } = props;
    const {imageStorage, query} = useContext(Context);
    const refId = useRefId({pattern, keyName});
    const {renderType, showListButton, showSubmitAndCancelButtons} = useRenderType({pattern, path, hideBackButton});
    const {
      subscribe,
      updateQuery,
      fetch,
      request,
      reset,
      deploy,
      onDeploy,
      removeOnDeploy
    } = useMethods({path, pattern});
    const {rootValue, originRootValue, value, fetching, updateToolbarQuery, args} = useFetch({
      type,
      relation,
      subscribe,
      fetch,
      updateQuery,
      refId,
      path
    });
    const {
      updateRelationQuery,
      relationFetching,
      relationArgs,
      relationQuery,
      relationRefId,
      relationKeyName,
      relationRootValue,
      relationValue,
      relationOriginRootValue,
    } = useRelation({
      relation,
      type,
      graphql,
      variables,
      fetchPolicy,
      refId
    })
    const {onChange} = useOnChange({rootValue, request});
    const {
      renderSubmitButton,
      renderCancelButton,
      shouldRenderSubmitButton,
      shouldRenderCancelButton
    } = useButtons({
      deploy,
      reset,
      rootValue,
      refId,
      controlDeployAndResetButtons,
      hideButtons,
      path,
      pattern
    })
    const {error, errorInfo} = useValidation({
      value,
      refId,
      required,
      validation
    });
    const componentOnDeploy = useOnDeploy({
      onDeploy,
      removeOnDeploy,
      refId,
    });
    const item = (
      <Context.Provider value={{
        fetch,
        subscribe,
        request,
        deploy,
        reset,
        updateQuery,
        onDeploy,
        removeOnDeploy,
        renderConfirmButton: renderSubmitButton,
        renderCancelButton,
        refId
      }}>
        <CannerItem
          layout={layout}
          required={required}
          type={type}
          description={description}
          hideTitle={hideTitle}
          imageStorage={imageStorage}
          title={title}
          fetching={fetching || relationFetching}
          relationValue={relationValue}
          onChange={onChange}
          onDeploy={componentOnDeploy.onDeploy}
          removeOnDeploy={componentOnDeploy.removeOnDeploy}
          // external
          error={error}
          errorInfo={errorInfo}
          shouldRenderSubmitButton={shouldRenderSubmitButton}
          shouldRenderCancelButton={shouldRenderCancelButton}
          renderType={renderType}
          showListButton={showListButton}
          showSubmitAndCancelButtons={showSubmitAndCancelButtons}
        >
          {props => <Com {...props} />}
        </CannerItem>
      </Context.Provider>
    )

    if (pattern === 'array' || type === 'relation') {
      return (
        <Toolbar items={items}
          toolbar={toolbar}
          args={type === 'relation' ? relationArgs : args}
          query={type === 'relation' ? relationQuery: query}
          refId={type === 'relation' ? relationRefId : refId}
          keyName={type === 'relation' ? relationKeyName: keyName}
          originRootValue={type === 'relation' ? relationOriginRootValue : originRootValue}
          rootValue={type === 'relation' ? relationRootValue: rootValue}
          updateQuery={type === 'relation' ? updateRelationQuery : updateToolbarQuery}
          request={request}
          deploy={deploy}
        >
          {item}
        </Toolbar>
      );
    }

    return item;
  }
}
