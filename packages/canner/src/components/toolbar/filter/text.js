import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'antd';
import get from 'lodash/get';
import set from 'lodash/set';

export default class TextFilter extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string
  };

  onInput = e => {
    const {name, onChange} = this.props;
    const {value} = e.target;
    if (!value) {
      onChange();
    } else {
      onChange(set({}, `${name}.eq`,  value));
    }
  }

  render() {
    const {label, where, name} = this.props;
    return (
      <Input
        data-testid={`text-filter-${name}`}
        style={{width: 140}}
        placeholder={label}
        onChange={this.onInput}
        defaultValue={get(where, `${name}.eq`, '')}
      />
    );
  }
}
