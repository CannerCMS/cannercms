// @flow

import * as React from 'react';
import {Layout} from 'antd';
import {pickBy} from 'lodash';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
// type
import type {CannerContainerProps, MenuConfig} from './types';

type State = {
  dataChanged: Object
};

class CannerContainer extends React.Component<CannerContainerProps, State> {
  cannerRef: React.ElementRef<any>;
  menuConfig: MenuConfig | boolean;
  uiSchema: Object;

  constructor(props: CannerContainerProps) {
    super(props);
    const {sidebarConfig, schema} = props;
    this.uiSchema = {...schema.pageSchema, ...pickBy(schema.schema, v => !v.defOnly)};

    if (sidebarConfig.menuConfig === true) {
      this.menuConfig = transformSchemaToMenuConfig(this.uiSchema);
    } else {
      this.menuConfig = sidebarConfig.menuConfig;
    }

    this.cannerRef = React.createRef();
    this.state = {
      dataChanged: {}
    }
  }

  dataDidChange = (dataChanged: Object) => {
    const {dataDidChange} = this.props;
    if (dataDidChange) {
      dataDidChange(dataChanged);
    }
    this.setState({
      dataChanged
    });
  }

  render() {
    const {
      schema,
      sidebarConfig,
      navbarConfig,
      children,
      router
    } = this.props;

    const {
      dataChanged
    } = this.state;

    const routes = router.getRoutes();
    const routerParams = {
      operator: router.getOperator(),
      payload: router.getPayload(),
      where: router.getWhere(),
      sort: router.getSort(),
      pagination: router.getPagination()
    };
    return (
      <Layout style={{
        WebkitBoxOrient: 'horizontal',
        WebkitBoxDirection: 'normal',
        WebkitFlexDirection: 'row',
        MsFlexDirection: 'row',
        flexDirection: 'row',
        minHeight: '100vh'
      }} >
        <Sidebar
          dataChanged={dataChanged}
          goTo={router.goTo}
          reset={this.cannerRef.current && this.cannerRef.current.reset}
          routes={routes}
          schema={this.uiSchema}
          {...sidebarConfig}
          menuConfig={this.menuConfig}
        />
        <Layout>
          {navbarConfig && (
            <Navbar
              dataChanged={dataChanged}
              deploy={this.cannerRef.current && this.cannerRef.current.deploy}
              {...navbarConfig}
            />
          )}
          <Layout.Content>
            { 
              React.cloneElement(children, {
                ref: this.cannerRef,
                dataDidChange: this.dataDidChange,
                schema,
                goTo: router.goTo,
                routes,
                routerParams
              })
            }
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export function transformSchemaToMenuConfig(schema: Object): MenuConfig {
  return Object.keys(schema)
    .filter(key => !schema[key].defOnly)
    .map(key => ({
      title: schema[key].title,
      pathname: `/${schema[key].keyName}`
    }));
}

export default CannerContainer;
