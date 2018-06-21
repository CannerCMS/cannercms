// @flow
import * as React from 'react';
import styled from 'styled-components';
import SelectFilter from './select';
import NumberFilter from './number';
// import DateRangeFilter from './dateRange';
import {Button, Row, Col} from 'antd';
import mergeWith from 'lodash/mergeWith';
import isEmpty from 'lodash/isEmpty';
import {FormattedMessage} from 'react-intl';
import defaultMessage from './locale';

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

type Props = {
  changeFilter: Object => void,
  fields: Array<{
    key: string,
    type: string,
    options: Array<{
      key: string,
      title: string
    }>,
    label: string
  }>,
  where: Object
}

type State = {
  condition: Object
}

class FilterGroup extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      condition: {
      },
    };
  }

  onChange = (cond: Object) => {
    let {condition} = this.state;
    if (isEmpty(cond)) {
      this.setState({
        condition: {}
      });
    } else {
      Object.keys(cond).forEach(key => {
        const newCond = cond[key];
        if (newCond === undefined) {
          delete condition[key];
        } else {
          condition[key] = cond[key]
        }
      })
    }
  }

  submit = () => {
    const {condition} = this.state;
    this.props.changeFilter(condition);
  }

  render() {
    const {fields, where} = this.props;
    const filters = fields.map((val) => {
      switch (val.type) {
        case 'select':
          return <SelectFilter onChange={this.onChange} options={val.options} where={where} label={val.label}/>;
        case 'number':
          return <NumberFilter onChange={this.onChange} name={val.key} label={val.label} where={where}/>;
        /*
        case 'dateRange':
          return <DateRangeFilter onChange={this.onChange} schema={{[val.key]: val}}/>
        */
        case 'text':
        default:
          return null;
          // return <TextFilter onChange={this.onChange} name={val.key} regexTemplate={val.regexTemplate} label={val.label}/>;
      }
    });
    return (
      <FilterRow type="flex" justify="space-between" align="bottom">
        <Col span={20}>
          <FilterPlugins>
            {[filters]}
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
