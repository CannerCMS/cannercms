import React from 'react';
import { Alert } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: table;
  height: 100%;
  position: absolute;
  width: 100%;
  left: 0;
`;

const Inner = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const Content = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

export default function Error() {
  return (
    <Wrapper>
      <Inner>
        <Content>
          <Alert
            type="error"
            showIcon
            message="Invalid sidebar menu"
            description={'We occurs error while rendering your sidebar menu\'s settings, please upload a fixed version'}
          />
        </Content>
      </Inner>
    </Wrapper>
  );
}
