import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import {Row, Col, Select, Icon} from 'antd';
const Option = Select.Option;
import styles from './style/sort.scss';
import {FormattedMessage} from 'react-intl';
import defaultMessage from '../locale';

@CSSModules(styles, {allowMultiple: true})
export default class Sort extends Component {
  static propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      order: 1,
      key: '',
    };
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
  }

  onSelect(key) {
    this.setState({
      key,
    }, this.onChange);
  }

  changeOrder() {
    this.setState({
      order: -this.state.order,
    }, this.onChange);
  }

  onChange() {
    const {onChange} = this.props;
    const {key, order} = this.state;
    onChange({[key]: order});
  }

  render() {
    const {options} = this.props;
    const {order} = this.state;
    return <Row type="flex" justify="end">
      <Col styleName="sort">
        <span styleName="label">
          <FormattedMessage
            id="query.sort.label"
            defaultMessage={defaultMessage.en['query.sort.label']}
          />
        </span>
        <Select styleName="select" onSelect={this.onSelect}>
          {options.map((cond, i) => <Option key={i} value={cond.key}>{cond.title}</Option>)}
        </Select>
        <div onClick={this.changeOrder} styleName="order-switch">
          <Icon styleName={order > 0 ? 'active icon' : 'icon'} type="caret-up" />
          <Icon styleName={order < 0 ? 'active icon' : 'icon'} type="caret-down" />
        </div>
      </Col>
    </Row>;
  }
}
