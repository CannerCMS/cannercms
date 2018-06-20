// @flow
import * as React from 'react';
import styled from 'styled-components';
// import DateRangeFilter from './dateRange';
import isUndefined from 'lodash/isUndefined';
import {Tabs} from 'antd';
const TabPane = Tabs.TabPane;

type Props = {
  changeFilter: Object => void,
  fields: Array<any>,
  where: Object,
  search: Object
}

const Wrapper = styled.div`
  box-shadow: 1px 1px 1px 1px #ccc;
  margin-bottom: 64px;
  .ant-tabs-bar {
    margin-bottom: 0;
  }
`

export default class TabsFilter extends React.Component<Props> {
  onChange = (index: number) => {
    const {fields} = this.props;
    this.props.changeFilter(fields[index].condition);
  }

  render() {
    const {fields, where} = this.props;
    const activeKey = fields.findIndex(field => JSON.stringify(field.condition) === JSON.stringify(where));
    return (
      <Wrapper>
        <Tabs activeKey={`${activeKey}`} defaultActiveKey="0" onChange={this.onChange}>
          {fields.map((field, i) => (
            <TabPane tab={field.title} key={i}></TabPane>
          ))}
        </Tabs>
      </Wrapper>
    );
  }
}
