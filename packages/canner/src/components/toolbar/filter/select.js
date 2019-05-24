// @flow
import React, { Component } from 'react';
import { Select } from 'antd';
import isUndefined from 'lodash/isUndefined';
import { injectIntl } from 'react-intl';

const Option = Select.Option;

type Props = {
  onChange: Function,
  name: string,
  options?: Array<{text: string, condition: any}>,
  label: string,
  intl: Object,
  index: number
}

// $FlowFixMe: decorator
@injectIntl
export default class SelectFilter extends Component<Props> {
  static propTypes = {

  };

  static defaultProps = {
    options: [],
  }

  onSelect = (val: number) => {
    const { onChange, options = [] } = this.props;
    if (isUndefined(val)) {
      return onChange({});
    }
    const selectedCondition = options[val].condition;
    onChange(selectedCondition);
  }

  render() {
    const { options, intl, index } = this.props;
    const placeholder = intl.formatMessage({ id: 'query.filter.select.placeholder' });
    return (
      <Select
        data-testid={`select-filter-${index}`}
        style={{ width: 120 }}
        placeholder={placeholder}
        onChange={val => this.onSelect(val)}
        allowClear
      >
        {(options || []).map((cond, i) => (
          // eslint-disable-next-line
          <Option value={i} key={i} data-testid={`select-filter-${index}-option-${i}`}>
            {cond.text}
          </Option>
        ))}
      </Select>
    );
  }
}
