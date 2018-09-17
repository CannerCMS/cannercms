/** @jsx builder */

import builder, {Block, Col, Default, Row} from 'canner-script';
import {postDashboardUIParams, userDashboardUIParams} from '../utils';
const dashboard = () => (
  <page keyName="dashboard" title="Dashboard">
    <Row type="flex" gutter={16}>
      <Col span={12}>
        <Block>
          <indicator ui="amount"
            keyName="totalUsers"
            graphql={
              `
                query users {
                  users {name age}
                }
              `
            }
            title="Total users"
            uiParams={{
              formatter: v => `${v}`
            }}
            getValue={v => v.length}
          />
        </Block>
      </Col>
      <Col span={12}>
        <Block>
          <indicator ui="amount"
            keyName="totalPosts"
            graphql={
              `
                query posts {
                  posts {id}
                }
              `
            }
            title="Total posts"
            uiParams={{
              formatter: v => `${v}`
            }}
            getValue={v => v.length}
          />
        </Block>
      </Col>
      <Col span={8}>
        <Block title="user-pie">
          <chart ui="pie"
            keyName="user-pie"
            graphql={
              `
                query users {
                  users(first: 10) {name age}
                }
              `
            }
            uiParams={{
              width: 200,
              field: 'age',
              color: {
                field: 'name'
              }
            }}
          />
        </Block>
      </Col>
      <Col span={8}>
        <Block title="user-bar">
          <chart ui="bar"
            keyName="user-bar"
            graphql={
              `
                query users {
                  users(first: 10) {name age}
                }
              `
            }
            uiParams={{
              height: 150,
              width: 200,
              color: {
                field: 'name'
              },
              x: {
                field: 'name'
              },
              y: {
                field: 'age'
              }
            }}
          />
        </Block>
      </Col>
      <Col span={8}>
        <Block title="user-line">
          <chart ui="line"
            keyName="user-line"
            graphql={
              `
                query users {
                  users(first: 10) {name age}
                }
              `
            }
            uiParams={{
              height: 150,
              width: 200,
              color: {
                field: 'name'
              },
              x: {
                field: 'name'
              },
              y: {
                field: 'age'
              }
            }}
          />
        </Block>
      </Col>
      <Col span={12} style={{maxHeight: 300}}>
        <Block title="posts">
          <indicator ui="list"
            keyName="posts"
            graphql={
              `
                query posts {
                  posts(first: 10) {title image}
                }
              `
            }
            uiParams={postDashboardUIParams}
          />
        </Block>
      </Col>
      <Col span={12}>
        <Block title="users">
          <indicator ui="list"
            keyName="users"
            graphql={
              `
                query users {
                  users(first: 10) {name email}
                }
              `
            }
            uiParams={userDashboardUIParams}
          />
        </Block>
      </Col>
    </Row>
  </page>
)

export default dashboard;
