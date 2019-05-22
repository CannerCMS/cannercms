// @flow

import  React from 'react';
// $FlowFixMe: antd Breadcrumb
import {Breadcrumb, Icon} from 'antd';
import {BackButton, Item} from 'canner-helpers';
import Buttons from 'canner/src/components/item/Buttons';

type Props = {
  id: string,
  title: string,
  description: string,

  schema: Object,
  routes: Array<string>
};

export default function DefaultUpdateBody({title, description, schema, routes}: Props) {
  const key = routes[0];
  const item = schema[key];
  const breadcrumbs = [{
    path: 'home',
    render: () => <Icon type="home" />
  }, {
    path: routes[0],
    render: () => item.title || title
  }];
  const itemRender = (route) => {
    return route.render();
  };
  return (
    <div>
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '16px 24px'
      }}>
        <div style={{
          marginBottom: 24
        }}>
          <Breadcrumb itemRender={itemRender} routes={breadcrumbs} />
        </div>
        <h2>{item.title || title}</h2>
        {
          (item.description || description) && (
            <div style={{
              marginTop: 8
            }}>
              {item.description || description}
            </div>
          )
        }
      </div>
      <div style={{
        padding: '16px',
        background: '#f0f2f5',
      }}>
        <div style={{
          padding: '16px',
          background: '#fff',
          minHeight: '100vh'
        }}>
          <BackButton />
          <Item />
          <Buttons
            shouldRenderCancelButton
            shouldRenderSubmitButton
          />
        </div>
      </div>
    </div>
  );
}
