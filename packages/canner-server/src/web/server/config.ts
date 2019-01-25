import {Context} from 'koa';
import path from 'path';

export interface CmsServerConfig {
  hostname?: string;
  staticsPath?: string;
  clientBundledDir?: string;

  /**
   * OIDC config
   * If `oidc` is null, all oidc features will be disabled
   */
  oidc: {
    // issuer
    // via Discovery
    discoveryUrl?: string;
    // manually
    issuer?: string;
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    userinfoEndpoint?: string;
    jwksUri?: string;

    // client
    clientId?: string;
    clientSecret?: string;

    // What attribute of claim should we use as username
    usernameClaim?: string;
    // Additional scopes we ask in authorization
    additionalScopes?: string[];
    // Whether we should force SSO to kill session as well or not during logout process
    forceSsoLogout?: boolean;
    // Customize SSO provider's logout procedure
    ssoLogout?: (ctx: Context) => Promise<any>;
  } | null;

  /**
   * Fully auth customizable middleware
   */
  beforeRenderCms?: (ctx: Context, next: () => Promise<any>) => Promise<void>;
  authCallback?: (ctx: Context, next: () => Promise<any>) => Promise<void>;
  logout?: (ctx: Context, next: () => Promise<any>) => Promise<void>;

  /**
   * Cookie
   */
  cookieKeys?: string[];
}

const defaultServerConfig = {
  staticsPath: '/public',
  clientBundledDir: path.join(process.cwd(), '.cms'),
  cookieKeys: ['canner-secret'],
};

export const createConfig = (customConfig?: CmsServerConfig): CmsServerConfig => {
  const mergedConfig = {
    ...defaultServerConfig,
    ...customConfig,
  };

  return mergedConfig;
};
