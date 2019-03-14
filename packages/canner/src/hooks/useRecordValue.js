// @flow
import {useState, useEffect} from 'react';
import {getRecordValue} from '../utils/value';

export default function useRecordValue({
  rootValue,
  refId
}: any) {
  const [recordValue, setRecordValue] = useState({});
  useEffect(() => {
    const recordValue = getRecordValue(rootValue, refId);
    setRecordValue(recordValue);
  }, [refId && refId.toString(), rootValue])
  return {recordValue}
}