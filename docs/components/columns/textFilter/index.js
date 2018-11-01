// @flow

import React from 'react';
import {Input, Button} from 'antd';
import styled from 'styled-components';
import get from 'lodash/get';

const Wrapper = styled.div`
  padding: 8px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .2);

  input {
    width: 130px;
    margin-right: 8px;
  }

  button {
    margin-right: 8px;
  }
`

const HightLight = styled.span`
  color: red;
`


type SetSelectedKeys = Array<string> => void;
type SelectedKeys = Array<string>;
type Confirm = () => void;
type ClearFilters = () => void;

let searchText = '';


export default class TextFilter {
  searchText = '';
  path = '';

  constructor(path: string) {
    this.path = path;
  }

  changeSearchKey = (text: string, setSelectedKeys: SetSelectedKeys) => {
    searchText = text;
    setSelectedKeys(text ? [text] : []);
  }
  
  reset = (clearFilters: ClearFilters) => {
    searchText = '';
    clearFilters();
  }
  
  onFilter = (value: string, record: Object) => get(record, this.path, '').toLowerCase().includes(value.toLowerCase());
  render = (text: string) => {
    return searchText ? (
      <span>
        {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment: string) => (
          fragment.toLowerCase() === searchText.toLowerCase()
            ? <HightLight>{fragment}</HightLight> : fragment // eslint-disable-line
        ))}
      </span>
    ) : text;
  }
  renderFilter = (props: {
    setSelectedKeys: SetSelectedKeys,
    selectedKeys: SelectedKeys,
    confirm: Confirm,
    clearFilters: ClearFilters
  }) => {
    const {setSelectedKeys, selectedKeys, confirm, clearFilters} = props;
    return (
      <Wrapper>
        <Input
          placeholder="Search name"
          value={selectedKeys[0]}
          onChange={e => this.changeSearchKey(e.target.value, setSelectedKeys)}
          onPressEnter={confirm}
        />
        <Button type="primary" onClick={confirm}>Search</Button>
        <Button onClick={() => this.reset(clearFilters)}>Reset</Button>
      </Wrapper>
    );
  }
  
}