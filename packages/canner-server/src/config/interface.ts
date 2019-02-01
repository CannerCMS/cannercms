import { CmsServerConfig } from '@canner/cms-server/lib/server/config';
import { GqlifyConfig } from '@canner/graphql-server/lib/config';
import { AuthConfig } from '@canner/auth-server/lib/config';
import { IssuerConfig } from '@canner/server-common/lib/oidcTokenVerifier';

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
