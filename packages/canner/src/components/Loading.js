// @flow
import React from 'react';
import { Alert } from 'antd';
import { List } from 'react-content-loader';

export default function Loading({ error }: any) {
  if (error) {
    return (
      <Alert
        message="Something went wrong."
        description={error}
        type="error"
        closable
      />
    );
  }
  return <List style={{ maxWidth: '600px' }} />;
}
