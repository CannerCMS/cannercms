import Koa from 'koa';
import { construct } from './config/factory';

// Service
import { GraphQLService } from './gqlify/app';
import { CmsWebService } from './web/server/app';
import { ServerConfig } from './config/interface';

export interface RootAppConfig {
  cookieKeys: string[];
}

export const createApp = async (config: ServerConfig) => {
  const app = new Koa();
  const {cmsConfig, graphqlConfig, rootAppConfig} = construct(config);

  // todo: isolate cookieKeys for different service
  // https://github.com/koajs/mount/pull/58
  app.keys = rootAppConfig.cookieKeys;

  // construct services
  const graphqlService = new GraphQLService(graphqlConfig);
  const cmsWebService = new CmsWebService(cmsConfig);

  // mount services
  await graphqlService.mount(app);
  await cmsWebService.mount(app);

  return app;
};
