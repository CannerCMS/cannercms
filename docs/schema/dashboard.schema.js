/** @jsx builder */

import builder, {Block, Row, Col} from 'canner-script';

export default () => (
  <page keyName="dashboard" title="${dashboard.title}">
    <Block>
      <Row>
        <Col span={8}>
          <indicator
            keyName="products-indicator"
            title="${dashboard.products}"
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
            title="${dashboard.orders}"
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
            title="${dashboard.customers}"
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