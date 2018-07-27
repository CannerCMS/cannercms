import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'antd';
import {FilterPlugin, Label} from './share';

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
      onChange({
        [name]: {
          eq: value
        }
      });
    }
  }

  render() {
    const {label} = this.props;
    return (
      <FilterPlugin>
        <Label>{label}</Label>
        <Input
          style={{width: '40%'}}
          placeholder={label}
          onChange={this.onInput}
        />
      </FilterPlugin>
    );
  }
}
