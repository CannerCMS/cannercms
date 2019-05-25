// @flow
import React, { Component } from 'react';
import { Input, Select } from 'antd';
import isNaN from 'lodash/isNaN';
import isEmpty from 'lodash/isEmpty';
import { injectIntl } from 'react-intl';

const Option = Select.Option;
// $FlowFixMe antd Input
const InputGroup = Input.Group;
const operators = [
  { symbol: '>', value: 'gt' },
  { symbol: '<', value: 'lt' },
  { symbol: '=', value: 'eq' },
  { symbol: '≥', value: 'gte' },
  { symbol: '≤', value: 'lte' },
];
type Props = {
  onChange: Function,
  name: string,
  label: string,
  intl: Object,
  index: number,
};

type State = {
  input: string;
  lowInput: string;
  operator: string;
};

// $FlowFixMe decorator
@injectIntl
export default class NumberRangeFilter extends Component<Props, State> {
  state = {
    input: '',
    lowInput: '',
    operator: 'gt',
  };

  onInputLow = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        lowInput: value,
      }, this.onChange);
    }
  }

  onInput = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        input: value,
      }, this.onChange);
    }
  }

  onChange() {
    const { lowInput, input, operator } = this.state;
    const { name, onChange } = this.props;
    if (operator === '$between') {
      onChange({
        name: {
          $gt: isEmpty(lowInput) ? -Infinity : Number(lowInput),
          $lt: isEmpty(input) ? Infinity : Number(input),
        },
      });
    } else {
      onChange(isEmpty(input) ? undefined : {
        [name]: {
          [operator]: Number(input),
        },
      });
    }
  }

  changeOperator = (val: string) => {
    this.setState({
      operator: val,
    }, this.onChange);
  }

  render() {
    const { intl, index } = this.props;
    const { operator, input } = this.state;
    const placeholder = intl.formatMessage({
      id: 'query.numberRange.placeholder',
    });
    return (
      <InputGroup compact>
        <Select
          style={{ width: 60 }}
          value={operator}
          onChange={this.changeOperator}
          data-testid={`number-filter-${index}-select`}
        >
          {
            operators.map(operator => (
              <Option key={operator.value} value={operator.value}>
                {operator.symbol}
              </Option>
            ))
          }
        </Select>
        <Input
          style={{ width: 120 }}
          data-testid={`number-filter-${index}-input`}
          placeholder={placeholder}
          value={input}
          onChange={this.onInput}
        />
      </InputGroup>
    );
  }
}
