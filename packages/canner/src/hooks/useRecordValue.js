// @flow
import { useState, useEffect } from 'react';
import { getRecordValue } from '../utils/value';

export default function useRecordValue({
  rootValue,
  refId,
}: any) {
  const [recordValue, setRecordValue] = useState({});
  const myRecordValue = getRecordValue(rootValue, refId);
  useEffect(() => {
    setRecordValue(myRecordValue);
  }, [refId && refId.toString(), JSON.stringify(myRecordValue)]);
  return { recordValue };
}
