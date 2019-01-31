import Koa, {Context} from 'koa';
import path from 'path';
import send from 'koa-send';
import Router from 'koa-router';
import koaMount from 'koa-mount';
import views from 'koa-views';
import { construct } from './auth/middleware';
import serve from './utils/serve';

// config
import { createConfig, CmsServerConfig } from './config';
import { WebService, Logger } from '../../common/interface';
import { create as createLoggerMiddleware } from '../../common/loggerMiddleware';

// constants
import { usernameCookieKey, accessTokenCookieKey, authCallbackPath } from './constants';

export class CmsWebService implements WebService {
  private logger: Logger;
  private config: CmsServerConfig;

  constructor(customConfig?: CmsServerConfig) {
    const config = createConfig(customConfig);
    this.config = config;
    this.logger = this.config.logger;
  }

  public async mount(rootApp: Koa) {
    const config = this.config;
    const app = new Koa();
    // todo: isolate the cookieKeys under mounted app
    // https://github.com/koajs/mount/pull/58
    app.keys = config.cookieKeys;

    // construct auth related middlewares
    const {
      beforeRenderCms,
      authCallback,
      logout,
    } = await construct(config, authCallbackPath);

    // logging
    const loggingMiddleware = createLoggerMiddleware(this.logger);

    // router
    const router = new Router();
    // error handler
    router.use('*', loggingMiddleware, async (ctx: Context, next) => {
      try {
        await next();
      } catch (err) {
        this.logger.fatal({
          message: err.message,
          stacktrace: err.stack,
        });
        const errorCode = (err.isBoom && err.data && err.data.code) ? err.data.code : 'INTERNAL_ERROR';
        const statusCode =
          (err.isBoom && err.output && err.output.statusCode) ? err.output.statusCode : err.status || 500;
  
        ctx.status = statusCode;
        ctx.body = {code: errorCode, message: err.message};
      }
    });

    router.use(views(path.join(__dirname, './views'), {
      extension: 'pug'
    }));

    // serve client static
    const clientStatic = serve(this.config.staticsPath, this.config.clientBundledDir);
    router.get(clientStatic.path, loggingMiddleware, clientStatic.middleware);

    // serve favicon
    const faviconPath = path.resolve(__dirname, '../public/favicon');
    const favicon = serve('/public/favicon', faviconPath);
    router.get(favicon.path, loggingMiddleware, favicon.middleware);

    // cms
    const setConfigMiddleware = async (ctx: Context, next: () => Promise<any>) => {
      // put into frontendConfig
      const username = ctx.cookies.get(usernameCookieKey, {signed: true});
      const accessToken = ctx.cookies.get(accessTokenCookieKey, {signed: true});
      ctx.state.frontendConfig = JSON.stringify({username, accessToken});
      return next();
    };

    router.get('/cms', loggingMiddleware, beforeRenderCms, setConfigMiddleware, async ctx => {
      await ctx.render('cms', {title: 'Canenr CMS', staticsPath: config.staticsPath});
    });

    router.get('/cms/*', loggingMiddleware, beforeRenderCms, setConfigMiddleware, async ctx => {
      await ctx.render('cms', {title: 'Canenr CMS', staticsPath: config.staticsPath});
    });

    // auth callback
    router.get(authCallbackPath, loggingMiddleware, authCallback, async ctx => {
      ctx.redirect('/cms');
    });

    // logout
    router.get('/auth/logout', loggingMiddleware, logout, async ctx => {
      // if logout middleware calls next, it will redirect to /cms
      ctx.redirect('/cms');
    });

    // health check
    router.get('/health', loggingMiddleware, async ctx => {
      ctx.status = 200;
    });

    // redirect
    router.get('/', loggingMiddleware, async (ctx: Context) => {
      return ctx.redirect('/cms');
    });

    app.use(router.routes());

    // mount cmsApp to rootApp
    const cmsMiddleware = koaMount(app);
    rootApp.use(cmsMiddleware);
  }
}
