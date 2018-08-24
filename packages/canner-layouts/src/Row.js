// @flow

import * as React from 'react';
import {Row} from 'antd';

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
  refId: any
};

export default class RowLayout extends React.Component<Props> {
  render() {
    // eslint-disable-next-line no-unused-vars
    const {align, gutter, justify, type, renderChildren, refId} = this.props;
    return <Row
      align={align}
      gutter={gutter}
      justify={justify}
      type={type}
    >
      {
        renderChildren({
          refId
        })
      }
    </Row>;
  }
}
