import {useContext} from 'react';
import {Context} from 'canner-helpers';
import RefId from 'canner-ref-id';

export default ({
  pattern,
  keyName,
  refId
}) => {
  const contextValue = useContext(Context);
  const {routerParams, routes, rootValue} = contextValue;
  const parentRefId = refId || contextValue.refId;

  if (!pattern || !keyName) {
    // layout component
    return parentRefId;
  }
  if (routerParams.operator === 'create' && pattern === 'array') {
    // in create form, the index must be 0
    return new RefId(`${keyName}/0`);
  } else if (pattern === 'array' && routes.length > 1) {
    // in update form, the index must be 0
    return new RefId(`${keyName}/0`);
  } else {
    return parentRefId ? parentRefId.child(keyName) : new RefId(keyName);
  }
}