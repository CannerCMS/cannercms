/** @jsx builder */

import builder, {Block, Row, Col} from 'canner-script';
import chart from 'canner-script/lib/models/chart';

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
        <Col span={8}>
          <indicator
            title="${dashboard.last6monthOrders}"
            keyName="last6month-orders-indicator"
            graphql={`
              query {
                chart {
                  salesData(last: 6) {
                    x
                    y
                  }
                }
              }
            `}
            uiParams={{
              formatter: v => {
                return `${v.total}`;
              }
            }}
            getValue={({salesData})=> {
              const total = salesData.reduce((acc, monthly) => acc + monthly.y, 0);
              return {
                total
              }
            }}
          />
        </Col>
      </Row>
    </Block>
    <Row gutter={16}>
      <Col span={8}>
        <Block title="Online Sales">
          <chart
            ui="bar"
            keyName="sales-online-bar"
            spec={{
              scales: [
                {
                  name: 'xscale',
                  type: 'band',
                  domain: {data: 'table', field: "x"},
                  range: 'width',
                  padding: 0.4,
                  round: true
                },
                {
                  name: 'yscale',
                  type: 'linear',
                  domain: {data: 'table', field: "y"},
                  nice: true,
                  range: 'height'
                },
              ]
            }}
            uiParams={{
              fill: "#07a4b8",
              x: {
                field: "x",
                title: "Types"
              },
              y: {
                field: "y",
                title: "Total Amount"
              },
              height: 200,
              width: "100%"
            }}
            getValue={({salesTypeDataOnline}) => {
              return salesTypeDataOnline;
            }}
            graphql={`
              query {
                chart {
                  salesTypeDataOnline {
                    x
                    y
                  }
                }
              }
            `}
            />
        </Block>
      </Col>
      <Col span={8}>
        <Block title="Offline Sales">
          <chart
            ui="bar"
            keyName="sales-offline-bar"
            spec={{
              axes: {
                grid: true
              },
              scales: [
                {
                  name: 'xscale',
                  type: 'band',
                  domain: {data: 'table', field: "x"},
                  range: 'width',
                  padding: 0.4,
                  round: true
                },
                {
                  name: 'yscale',
                  type: 'linear',
                  domain: {data: 'table', field: "y"},
                  nice: true,
                  range: 'height'
                },
              ]
            }}
            uiParams={{
              x: {
                field: "x",
                title: "Types"
              },
              y: {
                field: "y",
                title: "Total Amount"
              },
              height: 200,
              width: "100%"
            }}
            getValue={({salesTypeDataOffline}) => {
              return salesTypeDataOffline;
            }}
            graphql={`
              query {
                chart {
                  salesTypeDataOffline {
                    x
                    y
                  }
                }
              }
            `}
            />
        </Block>
      </Col>
      <Col span={8}>
        <Block title="Offline Sales">
          <chart
            ui="bar"
            keyName="sales-offline-online-stack-bar"
            spec={{
              axes: {
                grid: true
              },
              scales: [
                {
                  name: 'xscale',
                  type: 'band',
                  domain: {data: 'table', field: "x"},
                  range: 'width',
                  padding: 0.4,
                  round: true
                },
                {
                  name: 'yscale',
                  type: 'linear',
                  domain: {data: 'table', field: "y"},
                  nice: true,
                  range: 'height'
                },
              ]
            }}
            uiParams={{
              x: {
                field: "x",
                title: "Types"
              },
              y: {
                field: "y",
                title: "Total Amount"
              },
              height: 200,
              width: "100%"
            }}
            getValue={({salesTypeDataOffline}) => {
              return salesTypeDataOffline;
            }}
            graphql={`
              query {
                chart {
                  salesTypeDataOffline {
                    x
                    y
                  }
                }
              }
            `}
            />
        </Block>
      </Col>
    </Row>
  </page>
)