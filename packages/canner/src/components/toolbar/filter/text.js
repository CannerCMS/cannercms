// @flow
import React, { Component } from 'react';
import { Input } from 'antd';
import get from 'lodash/get';
import set from 'lodash/set';

type Props = {
  onChange: Function,
  where: Object,
  name: string,
  label: string,
  index: number,
}

export default class TextFilter extends Component<Props> {
  onInput = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name, onChange } = this.props;
    const { value } = (e.target: any);
    if (!value) {
      onChange();
    } else {
      onChange(set({}, `${name}.eq`, value));
    }
  }

  render() {
    const {
      label, where, name, index,
    } = this.props;
    return (
      <Input
        data-testid={`text-filter-${index}`}
        style={{ width: 140 }}
        placeholder={label}
        onChange={this.onInput}
        defaultValue={get(where, `${name}.eq`, '')}
      />
    );
  }
}
