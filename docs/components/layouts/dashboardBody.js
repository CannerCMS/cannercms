// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  id: string,
  title: string,
  description: string,
  routes: Array<string>
};

export default class Body extends React.Component<Props> {
  render() {
    return (
      <div style={{
        padding: '16px',
        background: '#f0f2f5',
        minHeight: '100vh'
      }}>
        <Item />
      </div>
    );
  }
}
