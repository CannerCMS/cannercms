import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input, Select} from 'antd';
import isNaN from 'lodash/isNaN';
import isEmpty from 'lodash/isEmpty';
import {injectIntl} from 'react-intl';
import {FilterPlugin, Label} from './share';
const Option = Select.Option;
const InputGroup = Input.Group;
const operators = [
  {symbol: '>', value: 'gt'},
  {symbol: '<', value: 'lt'},
  {symbol: '=', value: 'eq'},
  {symbol: '≥', value: 'gte'},
  {symbol: '≤', value: 'lte'},
];

@injectIntl
export default class NumberRangeFilter extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      lowInput: '',
      operator: 'gt',
    };
    this.onInputLow = this.onInputLow.bind(this);
    this.onInput = this.onInput.bind(this);
    this.changeOperator = this.changeOperator.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onInputLow(e) {
    const {value} = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        lowInput: value,
      }, this.onChange);
    }
  }

  onInput(e) {
    const {value} = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        input: value,
      }, this.onChange);
    }
  }

  changeOperator(val) {
    this.setState({
      operator: val,
    }, this.onChange);
  }

  onChange() {
    const {lowInput, input, operator} = this.state;
    const {name, onChange} = this.props;
    if (operator === '$between') {
      onChange(name, {
        $gt: isEmpty(lowInput) ? -Infinity : Number(lowInput),
        $lt: isEmpty(input) ? Infinity : Number(input),
      });
    } else {
      onChange(name, isEmpty(input) ? undefined : {
        [operator]: Number(input),
      });
    }
  }

  render() {
    const {label, intl} = this.props;
    const {operator, input, lowInput} = this.state;
    const placeholder = intl.formatMessage({
      id: 'query.numberRange.placeholder',
    });
    return (
      <FilterPlugin>
        <Label>{label}</Label>
        <InputGroup compact>
          <Input
            style={{width: '40%'}}
            value={lowInput}
            placeholder={placeholder}
            onChange={this.onInputLow}
            disabled={operator !== '$between'}
          />
          <Select style={{width: '20%'}}
            value={operator}
            onChange={this.changeOperator}
          >
            {
              operators.map((operator) =>
                <Option key={operator.value} value={operator.value}>
                  {operator.symbol}
                </Option>)
            }
          </Select>
          <Input
            style={{width: '40%'}}
            placeholder={placeholder}
            value={input}
            onChange={this.onInput}
          />
        </InputGroup>
      </FilterPlugin>
    );
  }
}
