/* globals FIREBASE_API_KEY */
import React from 'react';
import {Avatar} from 'antd';

function renderImages(values) {
  return (
    <React.Fragment>
      {
        values.map(image => (
          <img src={image.url} key={image.url} width="50" height="50" style={{marginRight: 3}}/>
        ))
      }
    </React.Fragment>
  );
}

function renderPosts(values) {
  return (
    <ul>
      {
        values.map(post => <li key={post.title}>{post.title}</li>)
      }
    </ul>
  );
}

export const postDashboardUIParams = {
  // eslint-disable-next-line
  avatar: value => (
    <Avatar
      src={value.image && value.image.url}
      style={{color: '#f56a00', backgroundColor: '#fde3cf'}}
    >
      {value.title}
    </Avatar>
  ),
  title: value => value.title,
  description: () => null,
  content: () => null
};

export const userDashboardUIParams = {
  // eslint-disable-next-line
  avatar: value => (
    <Avatar
      style={{color: '#f56a00', backgroundColor: '#fde3cf'}}
    >
      {value.name}
    </Avatar>
  ),
  title: value => value.name,
  description: value => value.email,
  content: () => null
};


export default {
  renderPosts,
  renderImages,
  storage,
  connector,
  graphClient: new PrismaClient(),
  imageStorage
}
