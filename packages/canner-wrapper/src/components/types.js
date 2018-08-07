// @flow
import * as React from 'react';
type ApolloClient = any;
export type CannerSchema = {
  [string]: any
};

export type LoadedSchema = {
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

export type CannerWrapperProps = {
  schema: LoadedSchema,
  goTo: string => void,
  routes: Array<string>,
  navbarConfig: NavbarConfig,
  sidebarConfig: SidebarConfig,
  children: React.Element<*>
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
};
