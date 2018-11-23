// @flow
import * as React from 'react';
import {Tooltip, Icon, Alert, Row, Col} from 'antd';
import {HOCContext} from './context';
import {Context} from 'canner-helpers';
import styled from 'styled-components';
import {isEmpty} from 'lodash';
import type {HOCProps} from './types';

const Title = styled.div`
  color: rgba(0, 0, 0, 0.85);
  padding: ${props => props.layout === 'horizontal' ? 0 : '0 0 8px'}

  & > span:before {
    content: ${props => props.required && props.title ? '"* "' : '""'};
    color: red;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
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

// $FlowFixMe
export default function withTitleAndDescription(Com: React.ComponentType<*>) {
  return class ComponentWithTitleAndDescription extends React.Component<HOCProps> {
    render() {
      const {title, layout, description, hideTitle,
        fetch, subscribe, request, deploy, reset, query,
        renderChildren, renderComponent, renderConfirmButton, renderCancelButton,
        refId, routes, updateQuery, type, imageStorage,
        onDeploy, removeOnDeploy, required, dataChanged, error, errorInfo
      } = this.props;

      const labelCol = layout === 'horizontal' ? this.props.labelCol || {
        span: 6
      } : null;

      const itemCol = layout === 'horizontal' ?  this.props.itemCol || {
        span: 14
      } : null;

      // $FlowFixMe: default funcitons in HOCContext only throw error, so they don't have any arguments
      return <HOCContext.Provider
        value={{
          fetch,
          subscribe,
          request,
          deploy,
          reset,
          query,
          updateQuery,
          onDeploy,
          removeOnDeploy,
          dataChanged
        }}
      >
        <Context.Provider value={{
          renderChildren,
          renderComponent,
          renderConfirmButton,
          renderCancelButton,
          refId,
          routes
        }}>
          <Row
            type={layout === 'horizontal' ? 'flex' : ''}
            style={{marginBottom: 24}}
          >
            <Col {...labelCol}>
              <Label
                required={required}
                type={type}
                layout={layout}
                description={description}
                title={hideTitle ? '' : title}
              />
            </Col>
            <Col {...itemCol}>
              {
                (type === 'image' && isEmpty(imageStorage)) && (
                  <Alert style={{margin: '16px 0'}} message="There is no storage config so you can't upload image. Checkout the storage section to know more" type="warning" />
                )
              }
              <Com {...this.props} />
              {
                error && (
                  <ErrorMessage>
                    {errorInfo[0].message}
                  </ErrorMessage>
                )
              }
            </Col>
          </Row>
        </Context.Provider>
      </HOCContext.Provider>
    }
  };
}
