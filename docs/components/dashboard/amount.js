import React from 'react';
import Indicator from '@canner/antd-indicator-amount';
import styled from 'styled-components';

const IconWrapper = styled.div`
  i {
    font-size: 28px;
  }
  margin-right: 16px;
  padding: 16px;
  border-radius: 50%;
  background: #1890ff;
`

export default class Amount extends React.Component {
  render() {
    const {value, icon, title, uiParams} = this.props;
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <IconWrapper>
            {icon}
          </IconWrapper>
          <Indicator title={title} uiParams={uiParams} value={value}/>
        </div>
      </div>
    )
  }
}
