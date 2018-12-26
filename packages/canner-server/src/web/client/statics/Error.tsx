import React, {Component} from 'react';
import {Alert} from 'antd';
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

export default class LockScreenLoading extends Component {
  render() {
    return (
      <Wrapper>
        <Inner>
          <Content>
            <Alert
              type="error"
              showIcon
              message="We occur errors"
              description="Sorry, your CMS have occurs some errors, please open your browser console to debug."/>
          </Content>
        </Inner>
      </Wrapper>
    );
  }
}