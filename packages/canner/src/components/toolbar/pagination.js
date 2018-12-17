// @flow
import React, {Component} from 'react';
import {Button, Icon, Pagination} from 'antd';
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
  changePage: number => void,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  changeSize: (size: number) => void,
  size: number,
  async: boolean,
  total: number,
  current: number
}

export default class PaginationPlugin extends Component<Props> {
  render() {
    const {nextPage, prevPage, hasNextPage, hasPreviousPage, async, total, changePage, current} = this.props;
    if (!async) {
      return <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Pagination current={current} onChange={changePage} total={total} />
      </div>;
    }
    return <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <Wrapper marginTop={16}>
        <ButtonGroup>
          <Button disabled={!hasPreviousPage} onClick={prevPage} data-testid="pagination-previous-button">
            <Icon type="left" />
            Previous
          </Button>
          <Button disabled={!hasNextPage} onClick={nextPage} data-testid="pagination-next-button">
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
