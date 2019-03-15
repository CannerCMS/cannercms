// @flow

import {useRef, useCallback} from 'react';
import {OnDeployManager} from '../onDeployManager';
export default () => {
  const onDeployManagerRef = useRef(new OnDeployManager());
  const publish = useCallback((key: string, value: any) => {
    return onDeployManagerRef.current.execute({
      key,
      value
    });
  })
  return {
    subscribe: onDeployManagerRef.current.registerCallback,
    unsubscribe: onDeployManagerRef.current.unregisterCallback,
    publish
  }
}