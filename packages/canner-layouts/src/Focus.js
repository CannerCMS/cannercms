import * as React from 'react';
import { Row, Col, Collapse } from 'antd';
import { Item } from 'canner-helpers';

const Panel = Collapse.Panel;

export default function Focus({
  childrenNode,
  focus,
  refId,
}) {
  return (
    <Row gutter={32} type="flex">
      <Col span={17}>
        <Item filter={node => focus.indexOf(node.keyName) !== -1} />
      </Col>
      <Col span={7}>
        <Collapse activeKey={childrenNode.map(child => child.keyName)}>
          {
          childrenNode.map(child => (
            focus.indexOf(child.keyName) === -1
              && (
              <Panel header={child.title || 'UNKNOWN TITLE'} key={child.keyName}>
                <Item
                  hideTitle
                  refId={refId}
                  filter={node => node.keyName === child.keyName}
                />
              </Panel>
              )
          ))
        }
        </Collapse>
      </Col>
    </Row>
  );
}
