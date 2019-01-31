import { ServerConfig } from './interface';
import { CmsServerConfig } from '../web/server/config';
import { GqlifyConfig } from '../gqlify/config';
import { get, defaultTo, merge } from 'lodash';
import { RootAppConfig } from '../app';
import { AuthConfig } from '../auth/config';
import { jsonLogger } from '../common/jsonLogger';

const defaultConfig = {
  cookieKeys: ['canner-secret'],
  public: false,
  clientId: 'canner',
  clientSecret: 'canner-client-secret',
  authMountPath: '/oidc',
};

// construct cms, graphql, auth config from ServerConfig
export const construct = (config: ServerConfig): {
  rootAppConfig: RootAppConfig,
  cmsConfig: CmsServerConfig,
  graphqlConfig: GqlifyConfig,
  authConfig: AuthConfig,
} => {
  // merge common config with default config
  const authMountPath = defaultConfig.authMountPath;
  const hostname = get(config, 'common.hostname');

  // cookieKeys will override auth & cms cookie config
  const cookieKeys = defaultTo(get(config, 'common.cookieKeys'), defaultConfig.cookieKeys);

  // Whether this cms is public access or not
  const publicAuth = defaultTo(get(config, 'common.public'), defaultConfig.public);

  // oidc clientId & clientSecret are shared between cms & auth services
  const clientId = defaultTo(get(config, 'common.clientId'), defaultConfig.clientId);
  const clientSecret = defaultTo(get(config, 'common.clientSecret'), defaultConfig.clientSecret);

  // oidc issuer
  const discoveryUrlFromHost = `${hostname}${authMountPath}/.well-known/openid-configuration`;
  const discoveryUrl = defaultTo(get(config, 'common.discoveryUrl'), discoveryUrlFromHost);
  const issuerConfig = get(config, 'common.issuerConfig');

  // construct config for cms service
  const cmsConfig: CmsServerConfig = merge({
    cookieKeys,
    hostname,
    oidc: {
      discoveryUrl,
      clientId,
      clientSecret,
    },
    logger: jsonLogger,
  }, config.cms);

  // config for gqlify service
  const graphqlConfig: GqlifyConfig = {
    logger: jsonLogger,
    oidc: {
      discoveryUrl,
      issuerConfig,
    },
    ...config.graphql,
  };

  // config for auth service
  let authConfig: AuthConfig = {
    mountPath: defaultConfig.authMountPath,
    issuer: hostname,
    cookies: {
      long: { signed: true, maxAge: (1 * 24 * 60 * 60) * 1000 }, // 1 day in ms
      short: { signed: true },
      keys: cookieKeys,
    },
    redirectUris: [`${hostname}/auth/callback`],
    postLogoutRedirectUris: [`${hostname}/`],
    clientId,
    clientSecret,
    logger: jsonLogger,
    ...config.auth,
  };

  const rootAppConfig = {
    cookieKeys,
  };

  // if publicAuth is true, we make this cms public
  // mark cmsConfig.oidc as null to tell cmsServer we do not need oidc
  // mark graphqlConfig.oidc as null to tell graphql server we do not need auth
  // mark authConfig to null, so auth service won't start
  if (publicAuth) {
    cmsConfig.oidc = null;
    graphqlConfig.oidc = null;
    authConfig = null;
  }

  return {
    rootAppConfig,
    cmsConfig,
    graphqlConfig,
    authConfig,
  };
};
