// @flow
import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  title: string,
  description: string,
};

export default function InnerBlock({
  title, description
}: Props) {
  return <div style={{
    margin: '24px 0',
    padding: '16px 32px',
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: '2px'
  }}>
    {
      title ?
        <div style={{
          margin: '-16px -32px 0 -32px',
          padding: '16px 32px',
          background: '#fafafa',
          borderBottom: '1px solid #eee'
        }}>
          <h3>{title}</h3>
          <div style={{
            color: '#aaa'
          }}>{description}</div>
        </div> :
        null
    }
    <Item />
  </div>;
}
