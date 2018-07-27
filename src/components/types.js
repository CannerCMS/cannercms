// @flow
import type {ApolloClient} from "apollo-boost";
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

export type DataDidChange = ({
  [key: string]: boolean | {[id: string]: any}
}) => void;

export type AfterDeploy = ({
  key: string,
  id: string,
  result: any
}) => void;

export type History ={
  push: (path: string) => void,
  location: Object
};

export type Intl = {
  locale: string,
  defaultLocale: string,
  message: Object
};

export type HideButtons = boolean;
export type BaseUrl = string;

export type CMSProps = {
  schema: LoadedSchema,
  dataDidChange: DataDidChange,
  afterDeploy: AfterDeploy,
  baseUrl: BaseUrl,
  goTo: string => void,
  routes: Array<string>,
  params: Object,
  intl: Intl,
  hideButtons: HideButtons
}

export type ReactRouterProviderProps = {
  children: React.Node,
  baseUrl: string,
  history: {
    location: Object,
    push: Function
  }
}

export type Submenu = {
  title: string,
  items: Sidebar,
}
export type MenuItem = {
  title: string,
  to: string
}

export type Sidebar = ?Array<Submenu | MenuItem>

export type SidebarProps = {
  schema: CannerSchema,
  sidebar: Sidebar,
  goTo: Function,
  dataChanged: Object,
  reset: Function,
  routes: Array<string>
}