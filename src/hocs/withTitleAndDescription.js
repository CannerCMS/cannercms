// @flow
import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
  id: string,
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  hideTitle?: boolean
};

// $FlowFixMe
export default function withTitleAndDescription(Com: React.ComponentType<*>) {
  return class ComponentWithTitleAndDescription extends React.Component<Props & {title: string, layout: 'inline' | 'vertical' | 'horizontal'}> {
    static contextTypes = {
      hideId: PropTypes.arrayOf(PropTypes.string)
    };

    render() {
      const {id, title, layout, description, hideTitle} = this.props;
      const {hideId} = this.context;
      if (hideTitle) {
        return <Com {...this.props}/>;
      }
      if (!hideId || hideId.indexOf(id) === -1) {
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
                <Com {...this.props}/>
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
                <Com {...this.props}/>
              </div>
            </div>;
        }
      }
      return null;
    }
  };
}