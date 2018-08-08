// @flow

import * as React from 'react';
import {Layout} from 'antd';

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

  constructor(props: CannerContainerProps) {
    super(props);
    const {sidebarConfig, schema} = props;

    if (sidebarConfig.menuConfig === true) {
      this.menuConfig = transformSchemaToMenuConfig(schema.schema);
    } else {
      this.menuConfig = sidebarConfig.menuConfig;
    }

    this.cannerRef = React.createRef();
    this.state = {
      dataChanged: {}
    }
  }

  dataDidChange = (dataChanged: Object) => {
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
      <Layout>
        <Navbar
          dataChanged={dataChanged}
          deploy={this.cannerRef.deploy}
          {...navbarConfig}
        />
        <Layout>
          <Sidebar
            dataChanged={dataChanged}
            goTo={router.goTo}
            reset={this.cannerRef.reset}
            routes={routes}
            {...sidebarConfig}
            menuConfig={this.menuConfig}
          />
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

function transformSchemaToMenuConfig(schema): MenuConfig {
  return Object.keys(schema).map(key => ({
    title: schema[key].title,
    pathname: `/${schema[key].keyName}`
  }));
}

export default CannerContainer;
