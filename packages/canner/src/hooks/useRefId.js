import {useContext} from 'react';
import {Context} from 'canner-helpers';
import RefId from 'canner-ref-id';

export default ({
  pattern,
  keyName
}) => {
  const {refId, routerParams, routes} = useContext(Context);
  if (!pattern) {
    // layout component
    return refId;
  }
  if (routerParams.operator === 'create' && pattern === 'array') {
    return refId.child(keyName);
  } else if (pattern === 'array' && routes.length > 1) {
    // in update view, the index must be 0
    return refId.child(`${keyName}/0`);
  } else {
    return refId ? refId.child(keyName) : new RefId(keyName);
  }
}