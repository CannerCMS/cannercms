import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';
import isUndefined from 'lodash/isUndefined';
const Option = Select.Option;
import {injectIntl} from 'react-intl';

@injectIntl
export default class SelectFilter extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    options: PropTypes.array,
    label: PropTypes.string,
    intl: PropTypes.object,
  };

  static defaultProps = {
    options: []
  }

  onSelect = val => {
    const {onChange, options} = this.props;
    if (isUndefined(val)) {
      return onChange({});
    }
    const selectedCondition = options[val].condition;
    onChange(selectedCondition);
  }

  render() {
    const {options, intl, index} = this.props;
    const placeholder = intl.formatMessage({id: 'query.filter.select.placeholder'});
    return (
      <Select
        data-testid={`select-filter-${index}`}
        style={{width: 120}}
        placeholder={placeholder}
        onChange={(val) => this.onSelect(val)}
        allowClear
      >
        {options.map((cond, i) => (
          <Option value={i} key={i} data-testid={`select-filter-${index}-option-${i}`} >
            {cond.text}
          </Option>
        ))}
      </Select>
    );
  }
}
