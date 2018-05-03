// @flow
import * as React from 'react';
import {HOCContext} from './context';
import {Context} from '@canner/react-cms-helpers';

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

// $FlowFixMe
export default function withTitleAndDescription(Com: React.ComponentType<*>) {
  return class ComponentWithTitleAndDescription extends React.Component<Props & {title: string, layout: 'inline' | 'vertical' | 'horizontal'}> {
    render() {
      const {title, layout, description, hideTitle,
        fetch, subscribe, request, deploy, reset,
        renderChildren, renderComponent, renderConfirmButton, renderCancelButton,
        refId, routes
      } = this.props;
      if (hideTitle) {
        return  <HOCContext.Provider
          value={{
            fetch,
            subscribe,
            request,
            deploy,
            reset
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
            <Com {...this.props}/>
          </Context.Provider>
        </HOCContext.Provider>;
      }
      switch (layout) {
        case 'horizontal':
          return <div style={{
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
              <div style={{
                fontSize: 18,
                fontWeight: 400
              }}>
                {title}
              </div>
              <div style={{
                fontSize: 12,
                marginTop: 16,
                color: "#aaa"
              }}>
                {description}
              </div>
            </div>
            <div style={{
              flex: 2
            }}>
            <HOCContext.Provider
              value={{
                fetch,
                subscribe,
                request,
                deploy,
                reset
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
                <Com {...this.props}/>
              </Context.Provider>
            </HOCContext.Provider>
            </div>
          </div>;
        case 'vertical':
        default:
          return <div style={{
            margin: '16px 0 0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: 18,
                fontWeight: 400
              }}>
                {title}
              </div>
              <div style={{
                fontSize: 12,
                color: "#aaa",
                marginLeft: 16
              }}>
                {description}
              </div>
            </div>
            <div style={{
              marginBottom: 8
            }}>
              <HOCContext.Provider
                value={{
                  fetch,
                  subscribe,
                  request,
                  deploy,
                  reset
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
                  <Com {...this.props} />
                </Context.Provider>
              </HOCContext.Provider>
            </div>
          </div>;
      }
    }
  };
}
