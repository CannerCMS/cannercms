// @flow
import * as React from 'react';
import {Tooltip, Icon, Alert} from 'antd';
import {HOCContext} from './context';
import {Context} from 'canner-helpers';
import styled from 'styled-components';
import {isEmpty} from 'lodash';
import type {HOCProps} from './types';

const Title = styled.div`
  font-size: 18px;
  font-weight: 400;
  &:after {
    content: ${props => props.required ? '"*"' : '""'};
    color: red;
  }
`;

// $FlowFixMe
export default function withTitleAndDescription(Com: React.ComponentType<*>) {
  return class ComponentWithTitleAndDescription extends React.Component<HOCProps> {
    render() {
      const {title, layout, description, hideTitle,
        fetch, subscribe, request, deploy, reset, query,
        renderChildren, renderComponent, renderConfirmButton, renderCancelButton,
        refId, routes, updateQuery, type, imageServiceConfig,
        onDeploy, removeOnDeploy, required
      } = this.props;
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
          removeOnDeploy
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
          {
            hideTitle && <Com {...this.props}/>
          }
          {
            (!hideTitle && layout === 'horizontal') && <div style={{
              display: 'flex',
              margin: '16px 0',
              alignItems: 'center'
            }}>
              <div style={{
                marginRight: 8,
                display: 'flex',
                flex: 1,
                flexDirection: 'row'
              }}>
                <Title required={required}>
                  {title}
                </Title>
                {
                  description && (
                    <Tooltip placement="top" title={description}>
                      <Icon type="info-circle-o" style={{marginLeft: 12, color: '#aaa'}}/>
                    </Tooltip>
                  )
                }
              </div>
              {
                (type === 'image' && isEmpty(imageServiceConfig)) && (
                  <Alert style={{margin: '16px 0'}} message="There is no storage config so you can't upload image. Checkout the storage section to know more" type="warning" />
                )
              }
              <div style={{
                flex: 2
              }}>
                <Com {...this.props}/>
              </div>
            </div>
          }
          {
            (!hideTitle && layout !== 'horizontal') && <div style={{
              margin: '16px 0 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <Title required={required}>
                  {title}
                </Title>
                {
                  description && (
                    <Tooltip placement="top" title={description}>
                      <Icon type="info-circle-o" style={{marginLeft: 12, color: '#aaa'}}/>
                    </Tooltip>
                  )
                }
                
              </div>
              {
                (type === 'image' && isEmpty(imageServiceConfig)) && (
                  <Alert style={{margin: '16px 0'}} message={<p>There is no storage config so you can not upload image. Checkout the <a href="https://www.canner.io/docs/guides-image-upload.html" target="_blank" rel="noreferrer noopener" >storage section</a> to know more</p>} type="warning" />
                )
              }
              <div style={{
                marginBottom: 8
              }}>
                <Com {...this.props}/>
              </div>
            </div>
          }
        </Context.Provider>
      </HOCContext.Provider>
    }
  };
}
