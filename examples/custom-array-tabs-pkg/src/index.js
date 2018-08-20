import React, { Component } from "react";
import Tabs, { TabPane } from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";
import { Button, Icon, Modal } from "antd";
import {Item} from 'canner-helpers';
import 'antd/lib/tabs/style';

const {confirm} = Modal;

export default class TabUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '0',
    };
  }

  static defaultProps = {
    uiParams: {},
    value: []
  };

  handleTabChange = (key) => {
    this.setState({ activeKey: key });
  };

  handleCreate = () => {
    const {
      value,
      refId,
      onChange,
    } = this.props;
    const size = value.length;
    onChange(refId, 'create');
    this.setState({ activeKey: `${size}` });
  };

  handleDelete = (index) => {
    const { onChange, value, refId } = this.props;
    const that = this;
    confirm({
      title: "Confirm to delete?",
      onOk() {
        onChange(refId.child(index), "delete")
          .then(() => {
            that.setState({
              activeKey: `${value.length - 2}`
            });
          });
      }
    })
  };

  render() {
    const {
      value,
      refId,
      uiParams
    } = this.props;
    const { activeKey } = this.state;
    const panelFields = [];

    // set array content
    value.forEach((item, i) => {
      const thisId = refId.child(i);

      // generate panel title
      let title;
      const defaultTitle = `Item ${i + 1}`;

      if (uiParams.titleKey) {
        title = item.get(uiParams.titleKey) || defaultTitle;
      } else if (uiParams.titlePrefix) {
        title = `${uiParams.titlePrefix}${i + 1}` || defaultTitle;
      } else {
        title = defaultTitle;
      }

      const deleteBtn = (index) => (
        <Icon type="close-circle" onClick={() => this.handleDelete(index)} />
      );

      if (activeKey === `${i}`) {
        title = [deleteBtn(i), ' ', title];
      }

      panelFields.push(
        <TabPane
          tab={title}
          id={thisId}
          key={`${i}`}
          style={{overflow: 'hidden'}}
        >
          <Item
            refId={thisId}
          />
        </TabPane>
      );
    });
    
    return (
      <div style={{width: '100%'}}>
        <Tabs
          prefixCls='ant-tabs'
          activeKey={`${activeKey}`}
          tabBarPosition={'top'}
          renderTabBar={() => (
            <ScrollableInkTabBar
              extraContent={
                <Button style={{margin: '6px'}}onClick={this.handleCreate}>+ Add</Button>
              }
              />
          )}
          renderTabContent={() => (
            <TabContent tabBarPosition={'top'} animated={false} />
          )}
          onChange={this.handleTabChange}
        >
          {panelFields}
        </Tabs>
      </div>
    );
  }
}
