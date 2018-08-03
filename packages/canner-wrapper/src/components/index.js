// @flow

import * as React from 'react';
import {Layout} from 'antd';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

// type
import type {CannerWrapperProps, menuConfig} from './types';

type State = {
  dataChanged: Object
};

class CannerWrapper extends React.Component<CannerWrapperProps, State> {
  cannerRef: React.Ref;
  menuConfig: menuConfig;

  constructor(props: Props) {
    super(props);
    const {sidebarConfig, schema} = props;

    if (sidebarConfig.menuConfig == true) {
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
      goTo,
      routes
    } = this.props;

    const {
      dataChanged
    } = this.state;
  
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
            goTo={goTo}
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
                goTo,
                routes
              })
            }
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

function transformSchemaToMenuConfig(schema) {
  return Object.keys(schema).map(key => ({
    title: schema[key].title,
    pathname: schema[key].keyName
  }));
}

export default CannerWrapper;
