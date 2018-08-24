/** @jsx builder */

import builder, {Block, Col, Row} from 'canner-script';

export default (
  <root>
    <object keyName="rowAndCol" title="Row And Col">
      <Block>
        <Row>
          <Col span={5}>
            <string keyName="test1" title="test1" />
            <string keyName="test2" title="test2" />
          </Col>
          <Col span={5} offset={1}>
            <string keyName="test5" title="test5" />
            <string keyName="test6" title="test6" />
          </Col>
          <Col span={12} offset={1}>
            <image keyName="image" title="image" />
          </Col>
        </Row>
      </Block>
    </object>
  </root>
);