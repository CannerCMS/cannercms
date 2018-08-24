/** @jsx builder */

import builder, {Block, Row, Col} from 'canner-script';
const RowAndCol = () => <object keyName="rowAndCol" title="Row And Col">
  <Block>
    <Row>
      <Col span={8}>
        <string keyName="test1" title="test1" />
        <string keyName="test2" title="test2" />
      </Col>
      <Col span={8}>
        <string keyName="test3" title="test3" />
        <string keyName="test4" title="test4" />
      </Col>
      <Col span={8}>
        <string keyName="test5" title="test5" />
        <string keyName="test6" title="test6" />
      </Col>
    </Row>
  </Block>
</object>;

export default RowAndCol;
