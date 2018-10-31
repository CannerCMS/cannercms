/** @jsx builder */
import builder, {Row, Col} from 'canner-script';

export const Inline = ({children}) => (
  <Row type="flex" gutter={16}>
    <Col xs={24} sm={12} md={6} lg={6}>
      {children[0]}
    </Col>
    <Col xs={24} sm={12} md={6} lg={6}>
      {children[1]}
    </Col>
    {children[2] && (
      <Col xs={24} sm={12} md={6} lg={6}>
        {children[2]}
      </Col>
    )}
    {children[3] && (
      <Col xs={24} sm={12} md={6} lg={6}>
        {children[3]}
      </Col>
    )}
  </Row>
)