// @flow

import React, {useState, useCallback} from 'react';
import {Layout} from 'antd';
import {pickBy} from 'lodash';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
// type
import type {CannerContainerProps, MenuConfig} from './types';

function CannerContainer(props: CannerContainerProps) {
  const {
    schema,
    sidebarConfig,
    navbarConfig,
    children,
    router
  } = props;
  const uiSchema = {...schema.pageSchema, ...pickBy(schema.schema, v => !v.defOnly)};
  let menuConfig = sidebarConfig.menuConfig
  if (sidebarConfig.menuConfig === true) {
    transformSchemaToMenuConfig(uiSchema);
  }

  const cannerRef = React.createRef();
  const [dataChanged, setDataChanged] = useState({});
  const routes = router.getRoutes();
  const routerParams = {
    operator: router.getOperator(),
    payload: router.getPayload(),
    where: router.getWhere(),
    sort: router.getSort(),
    pagination: router.getPagination()
  };
  const dataDidChange = useCallback((dataChanged: Object) => {
    if (props.dataDidChange) {
      props.dataDidChange(dataChanged);
    }
    setDataChanged(dataChanged);
  }, [])
  return (
    <Layout
      style={{
          WebkitBoxOrient: 'horizontal',
          WebkitBoxDirection: 'normal',
          WebkitFlexDirection: 'row',
          MsFlexDirection: 'row',
          flexDirection: 'row',
          minHeight: '100vh'
        }}
    >
        <Sidebar
          dataChanged={dataChanged}
          goTo={router.goTo}
          reset={cannerRef.current && cannerRef.current.reset}
          routes={routes}
          schema={uiSchema}
          {...sidebarConfig}
          menuConfig={menuConfig}
        />
        <Layout>
          {navbarConfig && (
            <Navbar
              dataChanged={dataChanged}
              deploy={cannerRef.current && cannerRef.current.deploy}
              {...navbarConfig}
            />
          )}
          <Layout.Content>
            { 
              React.cloneElement(children, {
                ref: cannerRef,
                dataDidChange: dataDidChange,
                schema,
                goTo: router.goTo,
                routes,
                routerParams
              })
            }
          </Layout.Content>
        </Layout>
      </Layout>
  )
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
