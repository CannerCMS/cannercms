// @flow
import type {ApolloClient} from "apollo-boost";

export type CannerSchema = {
  [string]: any
};

export type LoadedSchema = {
  schema: CannerSchema,
  client: ApolloClient,
  connectors: {[string]: any},
  connector: any,
  resolvers: {[string]: any},
  graphqlClient: any
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
  history: History,
  intl: Intl,
  hideButtons: HideButtons
}