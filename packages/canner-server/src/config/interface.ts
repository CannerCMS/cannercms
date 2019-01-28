import { CmsServerConfig } from '../web/server/config';
import { GqlifyConfig } from '../gqlify/config';

export interface CommonConfig {
  hostname: string;
  cannerSchemaPath?: string;
  cookieKeys?: string[];
}

export interface CmsUIConfig {
  style?: any;
  sidebarMenu?: any;
}

export interface ServerConfig {
  common: CommonConfig;
  cms: CmsServerConfig & CmsUIConfig;
  graphql: GqlifyConfig | null;
  auth: any | null;
}
