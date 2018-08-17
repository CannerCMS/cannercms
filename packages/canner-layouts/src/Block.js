// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  id: string,
  title: string,
  description: string,
  name: string,
  routes: Array<string>
};

export default class Block extends React.Component<Props> {
  render() {
    // eslint-disable-next-line no-unused-vars
    const {title, description} = this.props;
    return <div style={{
      margin: '0 0 24px',
      padding: '16px 32px',
      background: '#fff',
      border: '1px solid #eee',
      borderRadius: '2px'
    }}>
      {
        title ?
          <div style={{
            margin: '0px -32px',
            padding: '16px 32px',
            borderBottom: '1px solid #eee'
          }}>
            <h3>{title}</h3>
            <div style={{
              color: '#aaa'
            }}>{description}</div>
          </div> :
          null
      }
      <div style={{marginTop: 16}}>
        <Item />
      </div>
    </div>;
  }
}
