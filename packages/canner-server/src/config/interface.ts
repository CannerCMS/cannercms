import { CmsServerConfig } from '../web/server/config';
import { GqlifyConfig } from '../gqlify/config';
import { AuthConfig } from '../auth/config';
import { IssuerConfig } from '../common/oidcTokenVerifier';

export interface CommonConfig {
  hostname: string;
  cannerSchemaPath?: string;
  cookieKeys?: string[];
  public?: boolean;
  clientId?: string;
  clientSecret?: string;
  discoveryUrl?: string;
  issuerConfig?: IssuerConfig;
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
