import { ServerConfig } from './interface';
import { CmsServerConfig } from '../web/server/config';
import { GqlifyConfig } from '../gqlify/config';
import { get } from 'lodash';

// construct cms, graphql, auth config from ServerConfig
export const construct = (config: ServerConfig): {
  cmsConfig: CmsServerConfig,
  graphqlConfig: GqlifyConfig,
} => {
  const cmsConfig: CmsServerConfig = {
    hostname: get(config, 'common.hostname'),
    ...config.cms,
  };

  const graphqlConfig: GqlifyConfig = config.graphql;

  return {
    cmsConfig,
    graphqlConfig,
  };
};
