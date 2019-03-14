// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  title: string,
};

export default function Collapse({title}: Props) {
  return <details>
    <summary>{title || 'detail'}</summary>
    <Item />
  </details>;
}
