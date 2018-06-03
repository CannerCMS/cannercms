// @flow
import * as React from 'react';
import {Tooltip, Icon} from 'antd';
import {HOCContext} from './context';
import {Context} from 'canner-helpers';
import type {Query} from '../query';
import styled from 'styled-components';
type Props = {
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  hideTitle?: boolean,

  updateQuery: Function,
  fetch: FetchDef,
  subscribe: SubscribeDef,
  request: RequestDef,
  deploy: DeployDef,
  reset: ResetDef,
  query: Query,

  renderChildren: ({[string]: any}) => React.Node,
  renderComponent: (refId: RefId, props: Object) => React.Node,
  renderConfirmButton: Object => React.Node,
  renderCancelButton: Object => React.Node,
  refId: RefId,
  routes: Array<string>,

  items: any,
  keyName: string,
  onChange: Function
};

const Title = styled.div`
  font-size: 18px;
  font-weight: 400;
`;

const Description = styled.div`
  font-size: 12px;
  margin-top: 16px;
  color: #aaa;
`;

// $FlowFixMe
export default function withTitleAndDescription(Com: React.ComponentType<*>) {
  return class ComponentWithTitleAndDescription extends React.Component<Props & {title: string, layout: 'inline' | 'vertical' | 'horizontal'}> {
    render() {
      const {title, layout, description, hideTitle,
        fetch, subscribe, request, deploy, reset, query,
        renderChildren, renderComponent, renderConfirmButton, renderCancelButton,
        refId, routes, updateQuery
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
                flexDirection: 'column'
              }}>
                <Title>
                  {title}
                </Title>
                <Description>
                  {description}
                  
                </Description>
              </div>
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
                <Title>
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
