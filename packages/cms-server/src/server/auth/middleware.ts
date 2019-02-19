import { Context } from 'koa';
import { CmsServerConfig } from '../config';
import { OidcHandler } from './oidcHandler';
import { pick } from 'lodash';

type KoaMiddleware = (ctx: Context, next: () => Promise<any>) => Promise<any>;

// pass-through middleware
const passThrough = (ctx: Context, next: () => Promise<any>) => next();

// construct middlewares from config
export const construct = async (config: CmsServerConfig, authCallbackPath: string): Promise<{
  beforeRenderCms: KoaMiddleware,
  authCallback: KoaMiddleware,
  logout: KoaMiddleware,
}> => {
  // if oidc is null, then we go with customized middlewares
  // if customized middlewares are all undefined, cms will be public accessible
  if (!config.oidc) {
    return {
      beforeRenderCms: config.beforeRenderCms || passThrough,
      authCallback: config.authCallback || passThrough,
      logout: config.logout || passThrough,
    };
  }

  // construct redirectUri
  // config.hostname should be like `https://cms.host.name`
  // authCallbackPath should be like `/auth/callback`
  const redirectUri = `${config.hostname}${authCallbackPath}`;
  const postLogoutRedirectUri = `${config.hostname}/`;
  const oidcHandler = new OidcHandler({
    redirectUri,
    postLogoutRedirectUri,
    usernameClaim: config.oidc.usernameClaim,
    additionalScopes: config.oidc.additionalScopes,
    forceSsoLogout: config.oidc.forceSsoLogout,
    discoveryUrl: config.oidc.discoveryUrl,
    issuerConfig: pick(config.oidc,
      ['issuer', 'authorizationEndpoint', 'tokenEndpoint', 'userinfoEndpoint', 'jwksUri']),
    clientId: config.oidc.clientId,
    clientSecret: config.oidc.clientSecret,
    ssoLogout: config.oidc.ssoLogout,
  });

  return {
    beforeRenderCms: oidcHandler.beforeRenderCms,
    authCallback: oidcHandler.authCallback,
    logout: oidcHandler.logout,
  };
};
