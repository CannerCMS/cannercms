import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Select, Icon} from 'antd';
const Option = Select.Option;
import {FormattedMessage} from 'react-intl';
import defaultMessage from '../locale';
import styled from 'styled-components';


const SortCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Label = styled.span`
  font-size: 14px;
  letter-spacing: 2px;
  font-weight: 400;
  color: #aaa;
`;

const Selector = styled(Select)`
  width: 150px;
  margin: 0 15px;
`;

const OrderSwitch = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const UpIcon = styled(Icon)`
  color: ${props => props.order > 0 ? '#333' : '#ccc'};
`;

const DownIcon = styled(Icon)`
  color: ${props => props.order > 0 ? '#ccc' : '#333'};
`

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
      <SortCol>
        <Label>
          <FormattedMessage
            id="query.sort.label"
            defaultMessage={defaultMessage.en['query.sort.label']}
          />
        </Label>
        <Selector onSelect={this.onSelect}>
          {options.map((cond, i) => <Option key={i} value={cond.key}>{cond.title}</Option>)}
        </Selector>
        <OrderSwitch onClick={this.changeOrder}>
          <UpIcon order={order} type="caret-up" />
          <DownIcon order={order} type="caret-down" />
        </OrderSwitch>
      </SortCol>
    </Row>;
  }
}
