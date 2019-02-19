// tslint:disable-next-line:no-implicit-dependencies
import { Context, ContextFunction } from 'apollo-server-core';
import { Logger } from '@canner/server-common/lib/interface';
import { IssuerConfig } from '@canner/server-common/lib/oidcTokenVerifier';

export interface GqlifyConfig {
  schemaPath?: string;
  dataSources?: Record<string, any>;
  context?: Context<any> | ContextFunction<any>;
  logger?: Logger;
  graphqlPlayground?: boolean;
  readOnlyAccessToken?: string;
  oidc?: {
    discoveryUrl?: string,
    issuerConfig?: IssuerConfig,
  } | null;
}
