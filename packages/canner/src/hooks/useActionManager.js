import {useRef} from 'react';
import {ActionManager} from '../action';
export default () => {
  const actionManagerRef = useRef(new ActionManager());
  return actionManagerRef.current;
}