// @flow

import React from 'react';
import styled from 'styled-components';
import {Tooltip, Icon} from 'antd';

const Title = styled.div`
  color: rgba(0, 0, 0, 0.85);
  padding: ${props => props.layout === 'horizontal' ? 0 : '0 0 8px'}

  & > span:before {
    content: ${props => props.required && props.title ? '"* "' : '""'};
    color: red;
  }
`;
export function Label({
  required,
  description,
  title,
  layout
}: {
  required: boolean,
  description: string,
  title: string,
  layout: string
}) {
  return (
    <Title required={required} title={title} layout={layout}>
      <span>{title}</span>
      {
        title && description && (
          <Tooltip placement="top" title={description}>
            <Icon type="info-circle-o" style={{marginLeft: 12, color: '#aaa'}}/>
          </Tooltip>
        )
      }
    </Title>
  )
}