// @flow

import * as React from 'react';
import {Breadcrumb, Icon} from 'antd';
import {Item} from 'canner-helpers';

type Props = {
  id: string,
  title: string,
  description: string,

  // routeMap is produced by visitor: body
  // it records the relation with route and dispaly string
  routeMap: {
    [route: string]: {
      title: string,
      description: string
    }
  },
  routes: Array<string>
};

export default class Body extends React.Component<Props> {
  render() {
    const {title, description, routeMap, routes} = this.props;
    const completeRoutes = routes.map((route, i) => {
      return routes.slice(0, i + 1);
    }).map(route => {
      return route.reduce((acc, now) => `${acc}${acc ? '/' : ''}${now}`, '');
    });
    Object.keys(routeMap).forEach(routeKey => {
      const reg = new RegExp(`^${routeKey}$`);
      completeRoutes.find(route => {
        const result = route.match(reg);
        if (result) {
          routeMap[result[0]] = routeMap[routeKey];
          return true;
        }
        return false;
      });
    });
    // const params = (new URL(document.location)).searchParams;
    // const op = params.op || 'update';
    // const defaultTitle = op === 'update' ? '編輯' : '新增';

    const currentRoute = routeMap[completeRoutes[completeRoutes.length - 1]] || {};
    return <div>
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '16px 48px 32px'
      }}>
        <div style={{
          marginBottom: 24
        }}>
          <Breadcrumb>
            <Breadcrumb.Item><Icon type="home" /></Breadcrumb.Item>
            {completeRoutes.map((route, i) => {
              return routeMap[route] ?
                <Breadcrumb.Item key={i}>{routeMap[route].title}</Breadcrumb.Item> :
                null;
            })}
          </Breadcrumb>
        </div>
        <h2>{currentRoute.title || title}</h2>
        <div style={{
          marginTop: 8
        }}>{currentRoute.description || description}</div>
      </div>
      <div style={{
        padding: '16px',
        background: '#f0f2f5',
        minHeight: '100vh'
      }}>
        <Item />
      </div>
    </div>;
  }
}
