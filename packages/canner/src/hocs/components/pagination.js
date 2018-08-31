// @flow
import React, {Component} from 'react';
import {Button, Icon} from 'antd';
import styled from 'styled-components';
const ButtonGroup = Button.Group;
const Wrapper = styled.div`
  text-align: right;
  margin-top: ${props => props.marginTop}px;
  margin-right: ${props => props.marginRight}px;
  display: inline-block;
`;

type Props = {
  nextPage: () => void,
  prevPage: () => void,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  changeSize: (size: number) => void,
  size: number
}

export default class PaginationPlugin extends Component<Props> {
  render() {
    const {nextPage, prevPage, hasNextPage, hasPreviousPage} = this.props;
    return <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <Wrapper marginTop={16}>
        <ButtonGroup>
          <Button disabled={!hasPreviousPage} onClick={prevPage}>
            <Icon type="left" />
            Previous
          </Button>
          <Button disabled={!hasNextPage} onClick={nextPage}>
            Next
            <Icon type="right" />
          </Button>
        </ButtonGroup>
      </Wrapper>
      {/* <Wrapper marginTop={16} marginRight={16}>
        <span>Page size: </span>
        <Select style={{width: 100}} onChange={changeSize} defaultValue={10}>
          <Option value={1}>1</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
      </Wrapper> */}
    </div>;
  }
}
