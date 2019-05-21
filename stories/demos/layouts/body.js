import React from 'react';
import Body from '../../../packages/canner-layouts/src/Body';

const schema = {
  posts: {
    keyName: 'posts',
    path: 'posts',
    title: 'Posts',
    type: 'array',
    items: {}
  }
};

class BodyDemo1 extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Body
          description="This is description!"
          routes={["posts"]}
          schema={schema}
        />
      </React.Fragment>
    );
  }
}


export default class BodyDemo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BodyDemo1/>
      </React.Fragment>
    )
  }
}
