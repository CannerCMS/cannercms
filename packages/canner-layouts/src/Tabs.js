import * as React from 'react';
import {Tabs} from 'antd';
import {Item} from 'canner-helpers';
const TabPane = Tabs.TabPane;

export default class Tab extends React.Component {
  render() {
    const {children} = this.props;
    return (
      <Tabs>
        {
          children.map((child, i) => (
            <TabPane key={i} tab={child.title} data-testid={`tabs-${child.keyName}`} >
              <Item
                hideTitle={true}
                filter={node => node.keyName === child.keyName}
              />
            </TabPane>
          ))
        }
      </Tabs>
    )
  }
}
