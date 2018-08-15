// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  title: string,
};

export default class Collapse extends React.Component<Props> {
  render() {
    const {title} = this.props;
    return <details>
      <summary>{title || 'detail'}</summary>
      <Item />
    </details>;
  }
}
