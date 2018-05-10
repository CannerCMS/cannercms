// @flow
import React, {Component} from 'react';
import {Row, Col, Select, Icon} from 'antd';
const Option = Select.Option;
import {FormattedMessage} from 'react-intl';
import defaultMessage from './locale';
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

type Props = {
  orderField: ?string,
  items: Object,
  options: Array<{
    key: string,
    title: string
  }>,
  orderType: 'ASC' | 'DESC',
  changeOrder: ({
    orderField: string,
    orderType: string
  }) => void
}

type State = {
  order: number,
  key: string
}

export default class Sort extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      order: 1,
      key: '',
    };
  }

  onSelect = (key: string) => {
    this.setState({
      key,
    }, this.onChange);
  }

  changeOrder = () => {
    this.setState({
      order: -this.state.order,
    }, this.onChange);
  }

  onChange = () => {
    const {changeOrder} = this.props;
    const {key, order} = this.state;
    changeOrder({
      orderField: key,
      orderType: order === 1 ? 'ASC' : 'DESC'
    });
  }

  render() {
    const {options, orderType, orderField} = this.props;
    return <Row type="flex" justify="end">
      <SortCol>
        <Label>
          <FormattedMessage
            id="query.sort.label"
            defaultMessage={defaultMessage.en['query.sort.label']}
          />
        </Label>
        <Selector onSelect={this.onSelect} value={orderField}>
          {options.map((cond, i) => <Option key={i} value={cond.key}>{cond.title}</Option>)}
        </Selector>
        <OrderSwitch onClick={this.changeOrder}>
          <UpIcon order={order(orderType)} type="caret-up" />
          <DownIcon order={order(orderType)} type="caret-down" />
        </OrderSwitch>
      </SortCol>
    </Row>;
  }
}


function order(orderType) {
  return orderType === 'ASC';
}