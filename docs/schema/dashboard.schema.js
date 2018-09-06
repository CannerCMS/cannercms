/** @jsx builder */

import builder, {Block, Row, Col, Default} from 'canner-script';
import {postDashboardUIParams, userDashboardUIParams} from '../utils';
const dashboard = () => (
  <page keyName="dashboard" title="Dashboard">
    <Default style={{display: 'flex', justifyContent: 'space-around'}}>
      <Col span={11}>
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
      <Col span={11}>
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
    </Default>
  </page>
)

export default dashboard;
