import Koa from 'koa';
import { construct } from './config/factory';

// Service
import { GraphQLService } from '@canner/graphql-server/lib/app';
import { CmsWebService } from '@canner/cms-server/lib/server/app';
import { AuthService } from '@canner/auth-server/lib/app';
import { ServerConfig } from './config/interface';
import { createMiddleware } from './playground';

export interface RootAppConfig {
  graphqlEndpoint: string;
  cookieKeys: string[];
}

export const createApp = async (config: ServerConfig) => {
  const app = new Koa();
  const {cmsConfig, graphqlConfig, rootAppConfig, authConfig} = construct(config);

  // todo: isolate cookieKeys for different service
  // https://github.com/koajs/mount/pull/58
  app.keys = rootAppConfig.cookieKeys;

  // construct services
  const cmsWebService = new CmsWebService(cmsConfig);
  await cmsWebService.mount(app);

  // graphql playground
  const playgroundMid = createMiddleware(
    ctx => {
      let headers = {};
      try {
        headers = JSON.parse(ctx.query.headers);
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.log('cannot parse headers');
      }
      return {
        tabs: [{
          endpoint: rootAppConfig.graphqlEndpoint,
          headers,
        }]
      };
    }
  );
  app.use(playgroundMid);

  // graphql service is optional, it might be created to other server
  if (graphqlConfig) {
    const graphqlService = new GraphQLService(graphqlConfig);
    await graphqlService.mount(app);
  }

  // auth service is optional, might be created to other server as well
  if (authConfig) {
    const authService = new AuthService(authConfig);
    await authService.mount(app);
  }

  return app;
};
