// @flow

import {useRef} from 'react';
import {OnDeployManager} from '../onDeployManager';
export default () => {
  const onDeployManagerRef = useRef(new OnDeployManager());
  return {
    subscribe: onDeployManagerRef.current.registerCallback,
    unsubscribe: onDeployManagerRef.current.unregisterCallback,
    publish: (key: string, value: any) => {
      return onDeployManagerRef.current.execute({
        key,
        value
      });
    }
  }
}