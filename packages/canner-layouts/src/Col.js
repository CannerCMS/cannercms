// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';
import {Col} from 'antd';

type Props = {
  offset: number,
  order: number,
  pull: number,
  push: number,
  span: number,
  xs: number | Object,
  sm: number | Object,
  md: number | Object,
  lg: number | Object,
  xl: number | Object,
  xxl: number | Object
};

export default class ColLayout extends React.Component<Props> {
  render() {
    // eslint-disable-next-line no-unused-vars
    const {offset, order, pull, push, span, xs, sm, md, lg, xl, xxl} = this.props;
    return <Col
      offset={offset}
      order={order}
      pull={pull}
      push={push}
      span={span}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      xxl={xxl}
    >
      <Item />
    </Col>;
  }
}
