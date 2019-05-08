// @flow
import type {ApolloClient} from "apollo-boost";
import * as React from 'react';

export type CannerSchema = {
  [string]: any
};

export type LoadedSchema = {
  schema: CannerSchema,
  pageSchema: CannerSchema,
  sidebar: Sidebar,
  visitors: Array<Object>,
  client: ApolloClient,
  connectors: {[string]: any},
  connector: any,
  resolvers: {[string]: any},
  graphqlClient: any,
  imageStorages: {[key: string]: any},
  fileStorages: {[key: string]: any},
  dict: Object
};
export type ComponentNode = any;

export type ComponentTree = {
  [string]: ComponentNode
}

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
  messages: Object
};

export type HideButtons = boolean;
export type BaseUrl = string;

export type CMSProps = {
  schema: LoadedSchema,
  goTo: Object => void,
  routes: Array<string>,
  routerParams: Object,
  client: ApolloClient,
  dataDidChange?: DataDidChange,
  afterDeploy?: AfterDeploy,
  baseUrl?: BaseUrl,
  intl?: Intl,
  hideButtons?: HideButtons,
  errorHandler?: Error => any,
  defaultKey?: string,
  rules?: any
}

export type GeneratorProps = {
  componentTree: ComponentTree,
  layouts: {[string]: React.ComponentType<*>},
  imageStorages: Object,
  fileStorages: Object,
  rules?: Object,
  goTo: Object => void,
  baseUrl: string,
  routes: Array<string>,
  routerParams: {[string]: string},
  refresh?: boolean,
  deploy?: Function,
  reset?: Function,
  onDeploy?: Function,
  removeOnDeploy?: Function,
  hideButtons: boolean,
  schema: Object,
  defaultKey?: string,
  request: Function,
  deploy: Function,
  reset: Function,
  updateQuery: Function,
  subscribe: Function,
  unsubscribe: Function,
  fetch: Function,
  query: any,
  dataChanged: any,
  formType: string
}

export type ProviderProps = {
  schema: CannerSchema,
  children: React.Element<*>,
  client: ApolloClient,
  rootKey: string,
  routes: Array<string>,
  routerParams: Object,
  errorHandler?: Error => any,
  dataDidChange?: DataDidChange,
  afterDeploy?: AfterDeploy,
};

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