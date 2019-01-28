import Koa, {Context} from 'koa';
import path from 'path';
import serve from 'koa-static';
import Router from 'koa-router';
import koaMount from 'koa-mount';
import views from 'koa-views';
import { construct } from './auth/middleware';

// config
import { createConfig, CmsServerConfig } from './config';
import { WebService, Logger } from '../../common/interface';
import { jsonLogger } from '../../common/jsonLogger';

// constants
import { usernameCookieKey, accessTokenCookieKey, authCallbackPath } from './constants';

export class CmsWebService implements WebService {
  private logger: Logger = jsonLogger;
  private config: CmsServerConfig;

  constructor(customConfig?: CmsServerConfig) {
    const config = createConfig(customConfig);
    this.config = config;
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

    // serve client static
    const serveClientStatic =
      koaMount(this.config.staticsPath, serve(this.config.clientBundledDir, {gzip: true, index: false}));
    app.use(serveClientStatic);

    // serve favicon
    const favicon =
      koaMount('/public/favicon', serve(path.resolve(__dirname, '../public/favicon'), {gzip: true, index: false}));
    app.use(favicon);

    // router
    const router = new Router();
    router.use(views(path.join(__dirname, './views'), {
      extension: 'pug'
    }));

    // cms
    const setConfigMiddleware = async (ctx: Context, next: () => Promise<any>) => {
      // put into frontendConfig
      const username = ctx.cookies.get(usernameCookieKey, {signed: true});
      const accessToken = ctx.cookies.get(accessTokenCookieKey, {signed: true});
      ctx.state.frontendConfig = JSON.stringify({username, accessToken});
      return next();
    };

    router.get('/cms', beforeRenderCms, setConfigMiddleware, async ctx => {
      await ctx.render('cms', {title: 'Canenr CMS', staticsPath: config.staticsPath});
    });

    router.get('/cms/*', beforeRenderCms, setConfigMiddleware, async ctx => {
      await ctx.render('cms', {title: 'Canenr CMS', staticsPath: config.staticsPath});
    });

    // auth callback
    router.get(authCallbackPath, authCallback, async ctx => {
      ctx.redirect('/cms');
    });

    // logout
    router.get('/auth/logout', logout, async ctx => {
      // if logout middleware calls next, it will redirect to /cms
      ctx.redirect('/cms');
    });

    // health check
    router.get('/health', async ctx => {
      ctx.status = 200;
    });

    // redirect
    router.get('/', async (ctx: Context) => {
      return ctx.redirect('/cms');
    });

    app.use(router.routes());

    // mount cmsApp to rootApp
    const cmsMiddleware = koaMount(app);
    rootApp.use(cmsMiddleware);
  }

  // logger
  public setLogger(logger: Logger) {
    this.logger = logger;
  }

  public getLogger(): Logger {
    return this.logger;
  }
}
