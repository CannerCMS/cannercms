// @flow
import { useState, useEffect } from 'react';
import type RefId from 'canner-ref-id';
import { isEqual } from 'lodash';
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
    const newFieldValue = getFieldValue(rootValue, refId.getPathArr());
    if (!isEqual(fieldValue, newFieldValue)) {
      // only update state when the value changes to improve the performance when fieldValue is array or object
      setFieldValue(newFieldValue);
    }
  }, [refId, rootValue]);
  return {
    fieldValue,
  };
}
