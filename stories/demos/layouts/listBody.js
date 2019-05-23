import React from 'react';
import {Divider} from 'antd';
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

function CustomizedListComponent() {
  return (
    <React.Fragment>
      <div style={style}>
        <span>This is List Component.</span>
      </div>
    </React.Fragment>
  );
}

class DefaultListBody extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Divider>Demo: Normal Body with formType is LIST</Divider>
        <Body
          description="This is description!"
          routes={["posts"]}
          schema={schema}
        />
      </React.Fragment>
    );
  }
}

class ListComponentBody extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Divider>Demo: Customized List Body Component</Divider>
        <Body
          routes={[]}
          listComponent={CustomizedListComponent}
        />
      </React.Fragment>
    );
  }
}

export default class ListBodyDemo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <DefaultListBody/>
        <ListComponentBody/>
      </React.Fragment>
    )
  }
}
