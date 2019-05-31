// @flow

import { useContext, useMemo } from 'react';
import { Context } from 'canner-helpers';
import RefId from 'canner-ref-id';

type Props = {
  pattern: string,
  keyName: string,
  refId: RefId,
  nodeType: string,
  routerParams: Object,
  routes: Array<string>
}

export default ({
  pattern,
  keyName,
  refId,
  nodeType,
  routerParams,
  routes
}: Props) => {
  const contextValue = useContext(Context);
  // hack, can override the parentRefId from properties
  const parentRefId = refId || contextValue.refId;
  let newRefIdString = '';
  if (!pattern || !keyName) {
    // layout component
    if (nodeType === 'layout.body') {
      newRefIdString = routes[0];
    } else {
      newRefIdString = parentRefId.toString();
    }
  }
  if (routerParams.operator === 'create' && pattern === 'array') {
    // in create form, the index must be 0
    newRefIdString = `${keyName}/0`;
  } else if (pattern === 'array' && routes.length > 1) {
    // in update form, the index must be 0
    newRefIdString = `${keyName}/0`;
  } else if (pattern === 'object' || pattern === 'array') {
    newRefIdString = `${keyName}`;
  } else {
    newRefIdString = parentRefId ? parentRefId.child(keyName).toString() : keyName;
  }

  return useMemo(() => new RefId(newRefIdString), [newRefIdString]);
};
