// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';
import {Card} from 'antd';

type Props = {
  style: Object
};

export default class Block extends React.Component<Props> {
  render() {
    const {style, ...rest} = this.props
    return <Card {...rest} style={{marginBottom: 16, ...style}}>
      <Item />
    </Card>;
  }
}
