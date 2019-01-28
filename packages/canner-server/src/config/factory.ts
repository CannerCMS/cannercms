import { ServerConfig } from './interface';
import { CmsServerConfig } from '../web/server/config';
import { GqlifyConfig } from '../gqlify/config';
import { get, defaultTo } from 'lodash';
import { RootAppConfig } from '../app';

const defaultConfig = {
  cookieKeys: ['canner-secret'],
};

// construct cms, graphql, auth config from ServerConfig
export const construct = (config: ServerConfig): {
  rootAppConfig: RootAppConfig,
  cmsConfig: CmsServerConfig,
  graphqlConfig: GqlifyConfig,
} => {
  // merge common config with default config
  const cookieKeys = defaultTo(get(config, 'common.cookieKeys'), defaultConfig.cookieKeys);
  const hostname = get(config, 'common.hostname');

  const cmsConfig: CmsServerConfig = {
    cookieKeys,
    hostname,
    ...config.cms,
  };

  const graphqlConfig: GqlifyConfig = config.graphql;

  const rootAppConfig = {
    cookieKeys,
  };

  return {
    rootAppConfig,
    cmsConfig,
    graphqlConfig,
  };
};
