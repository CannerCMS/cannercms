// @flow
import { useState, useEffect } from 'react';
import type RefId from 'canner-ref-id';
import { getFieldValue } from '../utils/value';

export default function useFieldValue({
  rootValue,
  refId,
}: {
  rootValue: Object,
  refId: RefId
}) {
  const [fieldValue, setFieldValue] = useState(() => getFieldValue(rootValue, refId.getPathArr()));
  useEffect(() => {
    const fieldValue = getFieldValue(rootValue, refId.getPathArr());
    setFieldValue(fieldValue);
  }, [refId.toString(), rootValue]);
  return {
    fieldValue,
  };
}
