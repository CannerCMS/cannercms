// @flow
import type {ApolloClient} from 'apollo-boost';
export type Connector = any;
export type CannerSchema = {[key: string]: Object};
export type LoadedSchema = {
  schema: CannerSchema,
  client: ApolloClient,
  connectors: {[string]: Connector};
}
export interface CannerProps {
  schema: {

  },
  dataDidChange: Object => void,
  afterDeploy: Object => void,
  children: React.ChildrenArray<React.Node>,
  client: ApolloClient,
  imageServiceConfigs: Object,
  hocs: {[string]: React.ComponentType<*>},
  goTo: (path: string) => void,
  baseUrl: string,

  history: {
    push: (path: string) => void,
    location: Object
  },
  intl: {
    locale: string,
    defaultLocale: string,
    message: Object
  },
  hideButtons: boolean
}