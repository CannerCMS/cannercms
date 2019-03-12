// @flow

import React, {useContext, useMemo, useCallback} from 'react';
import {Context} from 'canner-helpers';
import CannerItem from '../components/item';

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
      renderChildren
    } = props;
    const contextValue = useContext(Context);
    const {
      rootValue,
      request,
      imageStorage,
      onDeploy,
      removeOnDeploy,
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
        // external
        error={error}
        errorInfo={errorInfo}
      >
        {(cannerItemProps) => <Com {...props} {...contextValue} {...cannerItemProps} />}
      </CannerItem>
    )

    // if (pattern === 'array' || type === 'relation') {
    //   return (
    //     <Context.Provider value={{
    //       fetch,
    //       subscribe,
    //       request,
    //       deploy,
    //       reset,
    //       updateQuery,
    //       onDeploy,
    //       removeOnDeploy,
    //       renderConfirmButton: renderSubmitButton,
    //       renderCancelButton,
    //       refId
    //     }}>
    //       <Toolbar items={items}
    //         toolbar={toolbar}
    //         args={type === 'relation' ? relationArgs : args}
    //         query={type === 'relation' ? relationQuery: query}
    //         refId={type === 'relation' ? relationRefId : refId}
    //         keyName={type === 'relation' ? relationKeyName: keyName}
    //         originRootValue={type === 'relation' ? relationOriginRootValue : originRootValue}
    //         rootValue={type === 'relation' ? relationRootValue: rootValue}
    //         updateQuery={type === 'relation' ? updateRelationQuery : updateToolbarQuery}
    //         request={request}
    //         deploy={deploy}
    //       >
    //         {item}
    //       </Toolbar>
    //     </Context.Provider>
    //   );
    // }
    const myContextValue = {
      ...contextValue,
      refId: myRefId,
      renderChildren
    };
    return (
      <Context.Provider value={myContextValue}>
        {item}
      </Context.Provider>
    );
  }
}
