import {useRef} from 'react';
import {Query} from '../query';
export default (schema) => {
  const queryRef = useRef(new Query({schema}));
  return queryRef.current;
}