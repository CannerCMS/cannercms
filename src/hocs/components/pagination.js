// @flow
import React, {Component} from 'react';
import {Button} from 'antd';
import styled from 'styled-components';

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

type Props = {
  nextPage: () => void,
  prevPage: () => void,
  hasNextPage: boolean,
  changeSize: (size: number) => void,
  size: number
}

export default class PaginationPlugin extends Component<Props> {
  render() {
    const {nextPage, prevPage, hasNextPage} = this.props;
    return <ButtonsWrapper>
      <Button onClick={prevPage} type="primary">Prev</Button>
      <Button onClick={nextPage} type="primary" disabled={!hasNextPage}>Next</Button>
    </ButtonsWrapper>;
  }
}
