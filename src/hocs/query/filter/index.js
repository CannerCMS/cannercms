import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import TextFilter from './text';
import SelectFilter from './select';
import NumberRangeFilter from './numberRange';
// import DateRangeFilter from './dateRange';
import {Button, Row, Col} from 'antd';
import styles from './style/filter.scss';
import './style/filter.antd.scss';
import isUndefined from 'lodash/isUndefined';
import {FormattedMessage} from 'react-intl';
import defaultMessage from '../locale';

@CSSModules(styles)
export default class FilterGroup extends Component {
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
    const {schema} = this.props;
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
      <Row id="filter-plugin" styleName="filter" type="flex" justify="space-between" align="bottom">
        <Col span={20}>
          <div styleName="filter-plugins">
            {Object.keys(filters).map((key) => filters[key])}
          </div>
        </Col>
        <Col span={4} styleName="button-col">
          <Button type="primary" icon="search" size="large" onClick={this.submit}>
            <FormattedMessage
              id="query.filter.search"
              defaultMessage={defaultMessage.en['query.filter.search']}
            />
          </Button>
        </Col>
      </Row>
    );
  }
}
