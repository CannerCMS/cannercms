// @flow

import * as React from 'react';
import {Row, Col} from 'antd';

type Props = {
  id: string,
  title: string,
  description: string,
  name: string,
  routes: Array<string>,
  align: string,
  gutter: number,
  justify: string,
  type: string,
  renderChildren: Function,
  refId: any,
  style: Object,
  childrenNode: Array<Object>
};

export default class RowLayout extends React.Component<Props> {
  render() {
    // eslint-disable-next-line no-unused-vars
    const {align, gutter, justify, type, renderChildren, refId, style, childrenNode} = this.props;
    return <Row
      align={align}
      gutter={gutter}
      justify={justify}
      type={type}
      style={style}
    >
      {
        childrenNode.map((child, index) => {
          const {offset, order, pull, push, span, xs, sm, md, lg, xl, xxl, style} = child;
          if (child.nodeType === 'layout.col') {
            return <Col
              key={index}
              offset={offset}
              order={order}
              pull={pull}
              push={push}
              span={span}
              xs={xs}
              sm={sm}
              m={md}
              lg={lg}
              xl={xl}
              xxl={xxl}
              style={style}
            >
              {
                renderChildren((node, i) => ({
                  refId,
                  hidden: i !== index,
                }))
              }
            </Col>
          } else {
            return null;
            // return renderChildren((node, i) => ({
            //   refId,
            //   hidden: i !== index
            // }));
          }
        })
      }
    </Row>;
  }
}
