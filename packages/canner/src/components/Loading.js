// @flow
import React from 'react';
import {Alert} from 'antd';
import {List} from 'react-content-loader';
export default function Loading(props: any) {
  if (props.error) {
    return <Alert
      message="Something went wrong."
      description={props.error}
      type="error"
      closable
    />
  } else {
    return <List style={{maxWidth: '600px'}}/>;
  }
}