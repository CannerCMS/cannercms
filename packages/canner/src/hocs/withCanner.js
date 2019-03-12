// @flow

import React, {useContext} from 'react';
import {Context} from 'canner-helpers';
import CannerItem from '../components/item';

// hooks
import useRefId from '../hooks/useRefId';
import useOnChange from '../hooks/useOnChange';
import useValidation from '../hooks/useValidation';
import useOnDeploy from '../hooks/useOnDeploy';
import useFieldValue from '../hooks/useFieldValue';

export default function withCanner(Com: any) {
  return function(props: any) {
    const {
      pattern,
      keyName,
      type,
      required,
      validation,
      layout,
      description,
      title,
      hideTitle,
    } = props;
    const contextValue = useContext(Context);
    const {
      rootValue,
      request,
      imageStorage,
      onDeploy,
      removeOnDeploy
    } = contextValue;
    const refId = useRefId({pattern, keyName});
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
    const {onChange} = useOnChange({rootValue, request});
    const {fieldValue} = useFieldValue({rootValue, refId});
    const {error, errorInfo} = useValidation({
      value: fieldValue,
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
      <CannerItem
        refId={refId}
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
        removeOnDeploy={componentOnDeploy.removeOnDeploy}
        renderChildren={() => null}
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
    return (
      <Context.Provider value={{
        ...contextValue,
        renderCancelButton: () => null,
        renderConfirmButton: () => null,
        refId
      }}>
        {item}
      </Context.Provider>
    );
  }
}
