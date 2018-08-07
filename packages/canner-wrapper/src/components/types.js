// @flow
import * as React from 'react';

export type CannerSchema = {
  [string]: any
};

export type LoadedSchema = {
  schema: CannerSchema,
  sidebar: Sidebar,
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
  defaultPayload?: JSONString,
  filter?: JSONString
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

export type SidebarConfig = {
  menuConfig: Array<SubmenuConfig | MenuItemConfig> | boolean
};

export type NavbarConfig = {
  logo: string, // img url
  renderMenu: () => React.Node,
  showSaveButton: boolean
}

export type Router = {
  getRoutes: () => Array<string>,
  getParams: () => Object,
  goTo: ({pathname: string, params: Object}) => void
};

export type CannerWrapperProps = {
  schema: LoadedSchema,
  goTo: string => void,
  routes: Array<string>,
  navbarConfig: navbarConfig,
  SidebarConfig: SidebarConfig,
  children: React.Node,
  router: Router
};

export type NavbarProps = {
  dataChanged: Object,
  deploy: Function,
  ...NavbarConfig
};

export type SidebarProps = {
  goTo: Function,
  dataChanged: Object,
  reset: Function,
  routes: Array<string>,
  ...SidebarConfig
};
