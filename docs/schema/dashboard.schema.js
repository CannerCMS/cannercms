/** @jsx builder */

import builder, {Block} from 'canner-script';

const dashboard = () => (
  <page keyName="dashboard" title="Dashboard">
    <Block title="posts">
      <indicator ui="list"
        keyName="posts"
        graphql={
          `
            query posts{
              posts {title}
            }
          `
        }
        uiParams={{
          avatar: () => null,
          title: value => value.title,
          description: value => value.content,
          content: () => null
        }}
      />
    </Block>
  </page>
)

export default dashboard;
