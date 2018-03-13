import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextFilter from './text';
import SelectFilter from './select';
import NumberRangeFilter from './numberRange';
// import DateRangeFilter from './dateRange';
import {Button, Row, Col} from 'antd';
import isUndefined from 'lodash/isUndefined';
import {FormattedMessage} from 'react-intl';
import defaultMessage from '../locale';

const FilterRow = styled(Row)`
  margin-bottom: 30px;
  border: 1px #f8f8f8 solid;
  padding: 15px;
  margin-top: 20px;
  box-shadow: 1px 1px 4px #eee;
`;

const FilterPlugins = styled.div`
  flex: 1;
  margin-right: 15px;
  min-width: 100px;
`;

const ButtonCol = styled(Col)`
  text-align: right;
  padding-top: 16px;
`;

class FilterGroup extends Component {
  static propTypes = {
    schema: PropTypes.object,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      condition: {

      },
    };
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(key, cond) {
    let {condition} = this.state;
    if (isUndefined(cond)) {
      delete condition[key];
    } else {
      condition[key] = cond;
    }
    this.setState({
      condition,
    });
  }

  submit() {
    const {condition} = this.state;
    this.props.onChange(condition);
  }

  render() {
    const {schema, className} = this.props;
    const filters = schema.map((val) => {
      switch (val.type) {
        case 'select':
          return <SelectFilter onChange={this.onChange} name={val.key} options={val.options} label={val.label}/>;
        case 'numberRange':
          return <NumberRangeFilter onChange={this.onChange} name={val.key} label={val.label}/>;
        /*
        case 'dateRange':
          return <DateRangeFilter onChange={this.onChange} schema={{[val.key]: val}}/>
        */
        case 'text':
        default:
          return <TextFilter onChange={this.onChange} name={val.key} regexTemplate={val.regexTemplate} label={val.label}/>;
      }
    });
    return (
      <FilterRow className={className} type="flex" justify="space-between" align="bottom">
        <Col span={20}>
          <FilterPlugins>
            {Object.keys(filters).map((key) => filters[key])}
          </FilterPlugins>
        </Col>
        <ButtonCol span={4}>
          <Button type="primary" icon="search" size="large" onClick={this.submit}>
            <FormattedMessage
              id="query.filter.search"
              defaultMessage={defaultMessage.en['query.filter.search']}
            />
          </Button>
        </ButtonCol>
      </FilterRow>
    );
  }
}

export default styled(FilterGroup)`
  .ant-input,
  .ant-select-selection {
    height: 32px;
    line-height: 32px;
    border-radius: 20px;
  }

  .ant-select-selection__placeholder {
    height: 28px;
    line-height: 28px;      
  }

  .ant-select-dropdown {
    border-radius: 2px !important;
  }
`
