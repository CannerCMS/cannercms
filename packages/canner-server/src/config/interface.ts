import { CmsServerConfig } from '../web/server/config';
import { GqlifyConfig } from '../gqlify/config';
import { AuthConfig } from '../auth/config';
import { Logger } from '../common/interface';

export interface CommonConfig {
  hostname: string;
  cannerSchemaPath?: string;
  cookieKeys?: string[];
  public?: boolean;
  clientId?: string;
  clientSecret?: string;
}

export interface CmsUIConfig {
  style?: any;
  sidebarMenu?: any;
}

export interface ServerConfig {
  common: CommonConfig;
  cms?: CmsServerConfig & CmsUIConfig;
  graphql?: GqlifyConfig | null;
  auth?: AuthConfig | null;
}
