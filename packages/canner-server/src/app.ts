import Koa from 'koa';
import Router from 'koa-router';

// Service
import { GraphQLService } from './gqlify/app';
import { CmsWebService } from './web/server/app';

export interface AppConfig {
  schemaPath?: string;
  dataSources: Record<string, any>;
}

export const createApp = async (config: AppConfig) => {
  const app = new Koa();

  // construct services
  const graphqlService = new GraphQLService({
    schemaPath: config.schemaPath,
    dataSources: config.dataSources,
  });
  const cmsWebService = new CmsWebService();

  // mount services
  graphqlService.mount(app);
  cmsWebService.mount(app);

  return app;
}
