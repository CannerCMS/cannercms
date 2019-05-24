// @flow

import * as React from 'react';
import { Item } from 'canner-helpers';
import type CannerRefId from 'canner-ref-id';

type Props = {
  id: string,
  title: string,
  description: string,
  name: string,
  routes: Array<string>,
  recordValue: Object,
  match: (recordValue: Object, operator: 'create' | 'update') => boolean,
  defaultMode: 'disabled' | 'hidden',
  routerParams: {
    operator: 'create' | 'update',
  },
  refId: CannerRefId,
  hidden: boolean,
  disabled: boolean,
};

export default function Condition({
  recordValue, match, defaultMode = 'hidden', routerParams: { operator }, disabled, hidden,
}: Props) {
  const matchHidden = defaultMode === 'hidden' ? match(recordValue, operator) : true;
  const matchDisabled = defaultMode === 'disabled' ? !match(recordValue, operator) : false;
  return (
    <Item
      filter={() => !hidden && matchHidden}
      disabled={disabled || matchDisabled}
    />
  );
}
