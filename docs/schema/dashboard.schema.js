/** @jsx builder */

import builder, {Block, Col, Default, Row} from 'canner-script';
import {postDashboardUIParams, userDashboardUIParams} from '../utils';
const dashboard = () => (
  <page keyName="dashboard" title="Dashboard">
    <Row type="flex" gutter={16}>
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
              field: 'age',
              color: {
                field: 'name'
              }
            }}
          />
        </Block>
      </Col>
      <Col span={8} style={{maxHeight: 300}}>
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
      <Col span={8}>
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
