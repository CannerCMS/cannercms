// @flow

import React from 'react';
import {Button, message, Alert} from 'antd';
import RefId from 'canner-ref-id';

export default function (items: any) {
  return {
    renderChildren: (props: any) => {
      return 'This is children content.';
    }
  };
};
