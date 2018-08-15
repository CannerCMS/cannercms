// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  style: any,
};

export default class Default extends React.Component<Props> {
  render() {
    const {style} = this.props;
    return <div style={style}>
      <Item />
    </div>;
  }
}
