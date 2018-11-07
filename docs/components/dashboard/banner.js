import React from 'react';
import {Card} from 'antd';

export default function Banner({title, description}) {
  return (
    <Card style={{marginBottom: 16}}>
      <h2>{title}</h2>
      <div>
        {description}
      </div>
    </Card>
  )
}