import React, {Component} from 'react';
import PropTypes from 'prop-types';
import mapKeys from 'lodash/mapKeys';
import {Select} from 'antd';
import isUndefined from 'lodash/isUndefined';
const Option = Select.Option;
import {injectIntl} from 'react-intl';
import {FilterPlugin, Label} from './share';

@injectIntl
export default class Filter extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    options: PropTypes.array,
    label: PropTypes.string,
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  static defaultProps = {
    options: []
  }

  onSelect(val) {
    const {onChange, name, options} = this.props;
    if (isUndefined(val)) {
      return onChange(name, undefined);
    }
    // {_eq: 1} => {$eq: 1}
    const selectedCondition = mapKeys(options[val].condition, (val, key) => key.replace('_', '$'));
    onChange(name, selectedCondition);
  }

  render() {
    const {label, options, intl} = this.props;
    const placeholder = intl.formatMessage({id: 'query.filter.select.placeholder'});
    return (
      <FilterPlugin>
        <Label>{label}</Label>
        <Select
          style={{width: '100%'}}
          placeholder={placeholder}
          onChange={(val) => this.onSelect(val)}
          allowClear
        >
          {options.map((cond, i) => (
            <Option value={i} key={i}>
              {cond.text}
            </Option>
          ))}
        </Select>
      </FilterPlugin>
    );
  }
}
