/** @jsx builder */

import builder, {Block, Row, Col} from 'canner-script';

export default () => (
  <page
    keyName="dashboard"
    title="${dashboard.title}"
    description="${dashboard.desc}">
    <Block>
      <Row type="flex">
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <component
            packageName="@canner/antd-indicator-amount"
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
            transformData={({visitData})=> {
              const total = visitData.reduce((acc, daily) => acc + daily.y, 0);
              return {
                total,
                firstDay: visitData[0].x,
                lastDay: visitData[visitData.length - 1].x
              }
            }}
          />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <component
            packageName="@canner/antd-indicator-amount"
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
            transformData={({salesData})=> {
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
      <Col xs={24} sm={24} md={8} lg={8} xl={8} >
        <Block title="Online Visitors">
          <component
            packageName="@canner/victory-line"
            keyName="victory-online-visitors"
            container={{
              height: 300
            }}
            xAxis={{
              tickCount: 5,
              style: { tickLabels: { 
                angle: -30,
                textAnchor: "middle"
              } }
            }}
            transformData={({visitData}) => {
              return visitData;
            }}
            graphql={`
              query {
                chart {
                  visitData {
                    x
                    y
                  }
                }
              }
            `}
            />
        </Block>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8} >
        <Block title="Offline Visitors">
          <component
            packageName="@canner/victory-area"
            keyName="victory-offline-visitor"
            container={{
              height: 300
            }}
            xAxis={{
              tickCount: 5,
              style: { tickLabels: { 
                angle: -30,
                textAnchor: "middle"
              } }
            }}
            transformData={({visitData2}) => {
              return visitData2;
            }}
            graphql={`
              query {
                chart {
                  visitData2 {
                    x
                    y
                  }
                }
              }
            `}
            />
        </Block>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8} >
        <Block title="Offline and Online Visitors" description="test">
        <component
          packageName="@canner/victory-area-stack"
          keyName="victory-offline-online-visitors"
          container={{
            height: 300
          }}
          legend={{
            data: [{name: 'Online'}, {name: 'Offline'}],
          }}
          xAxis={{
            tickCount: 5,
            style: { tickLabels: { 
              angle: -30,
              textAnchor: "middle"
            } }
          }}
          transformData={({visitData, visitData2}) => {
            return [
              visitData,
              visitData2
            ];
          }}
          graphql={`
            query {
              chart {
                visitData {
                  x
                  y
                }
                visitData2 {
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
    <Row gutter={16}>
      <Col xs={24} sm={24} md={8} lg={8} xl={8} >
        <Block title="Online Sales">
          <component
            packageName="@canner/vega-chart-bar"
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
            transformData={({salesTypeDataOnline}) => {
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
      <Col xs={24} sm={24} md={8} lg={8} xl={8} >
        <Block title="Offline Sales">
          <component
            packageName="@canner/vega-chart-bar"
            keyName="sales-offline-bar"
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
            transformData={({salesTypeDataOffline}) => {
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
      <Col xs={24} sm={24} md={8} lg={8} xl={8} >
        <Block title="Offline and Online Sales">
          <component
            packageName="@canner/vega-chart-default"
            keyName="sales-offline-online-stack-bar"
            spec={{
              "height": 200,
              "signals": [
                {
                  name: "width",
                  value: "",
                  on: [
                    {
                      events: "window:resize,window:click",
                      update: `containerSize()[0]`
                    }
                  ]
                }
              ],
              autosize: {
                type: 'fit',
              },
              "scales": [
                {
                  "name": "x",
                  "type": "band",
                  "range": "width",
                  "domain": {"data": "table", "field": "x"}
                },
                {
                  "name": "y",
                  "type": "linear",
                  "range": "height",
                  "nice": true,
                  "zero": true,
                  "domain": {"data": "table", "field": "y1"}
                },
                {
                  "name": "color",
                  "type": "ordinal",
                  "range": "category",
                  "domain": {"data": "table", "field": "c"}
                }
              ],

              "data": [{
                "name": "table",
                "transform": [
                  {
                    "type": "stack",
                    "groupby": ["x"],
                    "sort": {"field": "c"},
                    "field": "y"
                  }
                ]
              }],

              "axes": [
                {"orient": "bottom", "scale": "x", "zindex": 1},
                {"orient": "left", "scale": "y", "zindex": 1, tickCount: {signal: 'height / 25'}}
              ],

              "marks": [
                {
                  "type": "rect",
                  "from": {"data": "table"},
                  "encode": {
                    "enter": {
                      "x": {"scale": "x", "field": "x"},
                      "width": {"scale": "x", "band": 1, "offset": -1},
                      "y": {"scale": "y", "field": "y0"},
                      "y2": {"scale": "y", "field": "y1"},
                      "fill": {"scale": "color", "field": "c"}
                    },
                    "update": {
                      "x": {"scale": "x", "field": "x"},
                      "width": {"scale": "x", "band": 1, "offset": -1},
                      "y": {"scale": "y", "field": "y0"},
                      "y2": {"scale": "y", "field": "y1"},
                      "fillOpacity": {"value": 1}
                    },
                    "hover": {
                      "fillOpacity": {"value": 0.5}
                    }
                  }
                }
              ]
            }}
            transformData={({salesTypeDataOffline, salesTypeDataOnline}) => {
              const salesTypeDataOfflineAddColor = salesTypeDataOffline.map(d => {
                d.c = 0;
                return d;
              });

              const salesTypeDataOnlineAddColor = salesTypeDataOnline.map(d => {
                d.c = 1;
                return d;
              })

              return {
                table: salesTypeDataOfflineAddColor.concat(salesTypeDataOnlineAddColor)
              };
            }}
            graphql={`
              query {
                chart {
                  salesTypeDataOnline {
                    x
                    y
                  }
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