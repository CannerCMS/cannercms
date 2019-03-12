import {useContext} from 'react';
import {Context} from 'canner-helpers';
import RefId from 'canner-ref-id';

export default ({
  pattern,
  keyName,
  refId
}) => {
  const contextValue = useContext(Context);
  const {routerParams, routes} = contextValue;
  const parentRefId = refId || contextValue.refId;
  if (!pattern) {
    // layout component
    return parentRefId;
  }
  if (routerParams.operator === 'create' && pattern === 'array') {
    return parentRefId.child(keyName);
  } else if (pattern === 'array' && routes.length > 1) {
    // in update view, the index must be 0
    return parentRefId.child(`${keyName}/0`);
  } else {
    return parentRefId ? parentRefId.child(keyName) : new RefId(keyName);
  }
}