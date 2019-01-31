import { Context } from 'koa';
import Boom from 'boom';
import { ErrorCodes } from './error';
import { GqlifyConfig } from './config';
import { isNil, get } from 'lodash';
import { createAuthHandler } from '../common/graphql';

export const createContext = (config: GqlifyConfig) => {
  const publicAccess = isNil(config.oidc);

  if (publicAccess) {
    return null;
  }

  const authHandler = createAuthHandler({
    discoveryUrl: get(config, 'oidc.discoveryUrl'),
    issuerConfig: get(config, 'oidc.issuerConfig'),
    readOnlyAccessToken: config.readOnlyAccessToken,
  });

  return async ({ ctx }: { ctx: Context }) => {
    const authorization = ctx.get('authorization');
    if (!authorization) {
      throw Boom.forbidden('authorization header required', {code: ErrorCodes.AUTH_HEADER_MISSING});
    }

    const accessToken = authorization.replace('Bearer ', '');
    if (!accessToken) {
      throw Boom.forbidden('access token required', {code: ErrorCodes.ACCESSTOKEN_MISSING});
    }

    // check with authHandler
    const authContext = await authHandler(accessToken);

    return {
      ...authContext
    };
  };
};
