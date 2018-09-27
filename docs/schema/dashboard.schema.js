/** @jsx builder */

import builder, {Block, Row, Col} from 'canner-script';

export default () => (
  <page keyName="dashboard" title="Dashboard">
    <Block>
      <Row>
        <Col span={8}>
          <indicator
            keyName="products-indicator"
            title="Total Products"
            graphql={`
              query products {
                products {id}
              }
            `}
            uiParams={{
              formatter: v => v
            }}
            getValue={v => v.length}
          />
        </Col>
        <Col span={8}>
          <indicator
            title="Total Orders"
            keyName="orders-indicator"
            graphql={`
              query orders {
                orders {id}
              }
            `}
            uiParams={{
              formatter: v => v
            }}
            getValue={v => v.length}
          />
        </Col>
        <Col span={8}>
          <indicator
            title="Total Customers"
            keyName="customers-indicator"
            graphql={`
              query customers {
                customers {id}
              }
            `}
            uiParams={{
              formatter: v => v
            }}
            getValue={v => v.length}
          />
        </Col>
      </Row>
    </Block>
  </page>
)