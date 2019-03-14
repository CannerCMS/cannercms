// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  style: any,
};

export default function Default({
  style
}: Props) {
  return <div style={style}>
    <Item />
  </div>;
}
