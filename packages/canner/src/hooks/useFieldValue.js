// @flow
import {useState, useEffect} from 'react';
import {getFieldValue} from '../utils/value';
import type RefId from 'canner-ref-id';

export default function useFieldValue({
  rootValue,
  refId
}: {
  rootValue: Object,
  refId: RefId
}) {
  const [fieldValue, setFieldValue] = useState(() => getFieldValue(rootValue, refId.getPathArr()));
  useEffect(() => {
    const fieldValue = getFieldValue(rootValue, refId.getPathArr());
    setFieldValue(fieldValue);
  }, [refId.toString(), rootValue])
  return {
    fieldValue
  };
}
