import React from 'react';
import {Button, Divider, Icon} from 'antd';
import Body from '../../../packages/canner-layouts/src/Body';

const schema = {
  posts: {
    keyName: 'posts',
    path: 'posts',
    title: 'Posts',
    type: 'array',
    items: {}
  },
  categories: {
    keyName: 'categories',
    path: 'categories',
    title: 'Categories',
    type: 'object',
    items: {}
  }
};

const style = {
  padding: '16px',
  background: '#f0f2f5',
  minHeight: '10vh'
};

function CustomizedUpdateComponent() {
  return (
    <React.Fragment>
      <div style={style}>
        This is Update Component.
      </div>
    </React.Fragment>
  );
}

class DefaultUpdateBody extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Divider>Demo: Normal Body with formType is UPDATE</Divider>
        <Body
          description="This is description!"
          routes={["posts"]}
          schema={schema}
        />
      </React.Fragment>
    );
  }
}

class DefaultUpdateBodyWithObjectType extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Divider>Demo: Normal Body with object type</Divider>
        <Body
          description="This is description!"
          routes={["categories"]}
          schema={schema}
        />
      </React.Fragment>
    );
  }
}

class UpdateComponentBody extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Divider>Demo: Customized Update Body Component</Divider>
        <Body
          routes={[]}
          updateComponent={CustomizedUpdateComponent}
        />
      </React.Fragment>
    );
  }
}

export default class UpdateBodyDemo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <DefaultUpdateBody/>
        <DefaultUpdateBodyWithObjectType />
        <UpdateComponentBody/>
      </React.Fragment>
    )
  }
}
