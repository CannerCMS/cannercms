/** @jsx builder */

import builder, {Block, Row, Col} from 'canner-script';

export default () => (
  <page
    keyName="dashboard"
    title="${dashboard.title}"
    description="${dashboard.desc}">
    <Block>
      <Row>
        <Col span={8}>
          <indicator
            keyName="last7days-visitor-indicator"
            title="${dashboard.last7daysVisitor}"
            graphql={`
              query {
                chart {
                  visitData(last: 7) {
                    x
                    y
                  }
                }
              }
            `}
            uiParams={{
              formatter: v => {
                return `${v.total}`;
              },
              note: v => {
                return `(${v.firstDay} ~ ${v.lastDay})`;
              }
            }}
            getValue={({visitData})=> {
              const total = visitData.reduce((acc, daily) => acc + daily.y, 0);
              return {
                total,
                firstDay: visitData[0].x,
                lastDay: visitData[visitData.length - 1].x
              }
            }}
          />
        </Col>
        {/* <Col span={8}>
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
        </Col> */}
      </Row>
    </Block>
  </page>
)