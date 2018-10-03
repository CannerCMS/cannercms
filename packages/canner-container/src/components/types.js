// @flow
import * as React from 'react';
type ApolloClient = any;
export type CannerSchema = {
  [string]: any
};

export type LoadedSchema = {
  pageSchema: CannerSchema,
  schema: CannerSchema,
  visitors: Array<Object>,
  client: ApolloClient,
  connectors: {[string]: any},
  connector: any,
  resolvers: {[string]: any},
  graphqlClient: any,
  storages: {[key: string]: any}
};

export type MenuParams = {
  operation?: 'create' | 'update',
  defaultPayload?: string,
  filter?: string
};

export type MenuItemConfig = {
  title: string,
  pathname: string,
  params?: MenuParams
};

export type SubmenuConfig = {
  title: string,
  items: Array<MenuItemConfig>
};

export type MenuConfig = Array<SubmenuConfig | MenuItemConfig>

export type SidebarConfig = {
  menuConfig: MenuConfig | boolean
};

export type NavbarConfig = {
  logo: string, // img url
  renderMenu: () => React.Node,
  showSaveButton: boolean
}

export type Router = {
  getRoutes: () => Array<string>,
  getOperator: () => 'create' | 'update',
  getPayload: () => Object,
  getWhere: () => Object,
  getSort: () => Object, 
  getPagination: () => Object,
  goTo: ({
    pathname: string,
    operator?: 'create' | 'update',
    payload?: Object,
    where?: Object,
    sort?: Object,
    pagination?: Object
  }) => void
};

export type CannerContainerProps = {
  schema: LoadedSchema,
  sidebarConfig: SidebarConfig,
  children: React.Element<any>,
  router: Router,
  navbarConfig?: NavbarConfig,
  dataDidChange?: Function
};

export type NavbarProps = NavbarConfig & {
  dataChanged: Object,
  deploy: Function,
};

export type SidebarProps = SidebarConfig & {
  goTo: Function,
  dataChanged: Object,
  reset: Function,
  routes: Array<string>,
  schema: CannerSchema
};
