import Koa, {Context} from 'koa';
import path from 'path';
import serve from 'koa-static';
import Router from 'koa-router';
import koaMount from 'koa-mount';

// config
import {createConfig, Config} from './config';


export const createApp = async (): Promise<{app: Koa, config: Config}> => {
  const config = createConfig();
  const staticPath = config.appPrefix ? `${config.appPrefix}/` : '/';

  // koa
  const app = new Koa() as any;

  // serve client static
  const serveClientStatic = config.appPrefix
    ? koaMount(config.appPrefix, serve(path.resolve(__dirname, '../../client/dist'), {gzip: true, index: false}))
    : serve(path.resolve(__dirname, '../../client/dist'), {gzip: true, index: false});
  app.use(serveClientStatic);

  // router
  const rootRouter = new Router({
    prefix: config.appPrefix
  });

  // redirect
  rootRouter.get('/', async (ctx: Context) => {
    return ctx.redirect(`${config.appPrefix || ''}/cms`);
  });

  // health check
  rootRouter.get('/health', async ctx => {
    ctx.status = 200;
  });
  app.use(rootRouter.routes());
  return {app, config};
};
