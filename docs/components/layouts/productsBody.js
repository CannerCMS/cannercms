// @flow

import * as React from 'react';
import {Breadcrumb, Icon, Card} from 'antd';
import {Item} from 'canner-helpers';

type Props = {
  id: string,
  title: string,
  description: string,

  schema: Object,
  routes: Array<string>
};

export default class Body extends React.Component<Props> {
  render() {
    const {title, description, schema, routes} = this.props;
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
    }
    return <div>
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '16px 24px',
        position: 'relative'
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
        <Links />
        <img src="https://cdn.canner.io/images/innerPages/banner.png"
          height="80%"
          style={{
            position: 'absolute',
            right: '10%',
            bottom: '10px'
          }}
        />
      </div>
      <div style={{
        padding: '16px',
        background: '#f0f2f5',
        minHeight: '100vh'
      }}>
        <Card>
          <Item />
        </Card>
      </div>
    </div>;
  }
}

function Link({icon, name}) {
  return (
    <a href="#" style={{marginRight: 36}}>
      <Icon type={icon} theme="outlined"
        style={{padding: 4, border: '1px solid', borderRadius: '50%', marginRight: 8}}
      />
      {name}
    </a>
  );
}

function Links() {
  return (
    <div
      style={{marginTop: 24, fontSize: 18, fontWeight: 100}}
    >
      <Link icon="rocket" name="Link1"/>
      <Link icon="bulb" name="Link1" />
      <Link icon="compass" name="Link1" />
    </div>
  )
}
