// @flow
import React from 'react';

export default function (items: any) {
  const { formType } = items;
  return {
    renderChildren: (props: any) => {
      return 'This is children content.';
    },
    formType
  };
};
