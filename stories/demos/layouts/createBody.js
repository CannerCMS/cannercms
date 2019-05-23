import React from 'react';
import {Button, Divider} from 'antd';
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

const style = {
  padding: '16px',
  background: '#6e9ceb',
  minHeight: '10vh'
};

function CustomizedCreateComponent() {
  return (
    <React.Fragment>
      <div style={style}>
        This is Create Component.
      </div>
    </React.Fragment>
  );
}


class DefaultCreateBody extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Divider>Demo: Normal Body with formType is CREATE</Divider>
        <Body
          routes={["posts"]}
          schema={schema}
        />
      </React.Fragment>
    );
  }
}

class CreateComponentBody extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Divider>Demo: Customized Create Body Component</Divider>
        <Body
          routes={[]}
          createComponent={CustomizedCreateComponent}
        />
      </React.Fragment>
    );
  }
}

export default class CreateBodyDemo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <DefaultCreateBody/>
        <CreateComponentBody/>
      </React.Fragment>
    )
  }
}
