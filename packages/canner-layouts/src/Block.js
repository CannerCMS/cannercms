// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';
import {Card, Tooltip, Icon} from 'antd';

type Props = {
  style: Object,
  headStyle: Object,
  bodyStyle: Object,
  bordered: boolean,
  cover: React.Node,
  extra: string | React.Node,
  hoverable: boolean,
  title: string,
  type: string,
  description: string,
};

export default class Block extends React.Component<Props> {
  render() {
    const {style, headStyle, bodyStyle, bordered, cover, hoverable, title, type, description} = this.props
    const extra = this.props.extra || (
      description && (
        <Tooltip placement="top" title={description}>
          <Icon type="info-circle-o" style={{marginLeft: 12, color: '#aaa'}}/>
        </Tooltip>
      )
    )
    return <Card
      headStyle={headStyle}
      bodyStyle={bodyStyle}
      bordered={bordered}
      cover={cover}
      extra={extra}
      hoverable={hoverable}
      title={title}
      type={type}
      style={{marginBottom: 16, ...style}}
    >
      <Item />
    </Card>;
  }
}
