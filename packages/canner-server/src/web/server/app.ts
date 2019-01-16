import Koa, {Context} from 'koa';
import path from 'path';
import serve from 'koa-static';
import Router from 'koa-router';
import koaMount from 'koa-mount';
import views from 'koa-views';

// config
import { createConfig, CmsServerConfig } from './config';
import { WebService, Logger } from '../../common/interface';
import { jsonLogger } from '../../common/jsonLogger';

export class CmsWebService implements WebService {
  private logger: Logger = jsonLogger;
  private router: Router;

  constructor(customConfig?: CmsServerConfig) {
    const config = createConfig(customConfig);

    // router
    const router = new Router();
    router.use(views(path.join(__dirname, './views'), {
      extension: 'pug'
    }));

    // serve client static
    const serveClientStatic = koaMount(config.staticsPath, serve(config.clientBundledDir, {gzip: true, index: false}));
    router.use(serveClientStatic);

    // serve favicon
    const favicon = koaMount('/public/favicon', serve(path.resolve(__dirname, '../public/favicon'), {gzip: true, index: false}));
    router.use(favicon);

    // cms
    router.get('/cms', async ctx => {
      await ctx.render('cms', {title: 'Canenr CMS', staticsPath: config.staticsPath});
    });
    router.get('/cms/*', async ctx => {
      await ctx.render('cms', {title: 'Canenr CMS', staticsPath: config.staticsPath});
    });

    // health check
    router.get('/health', async ctx => {
      ctx.status = 200;
    });

    // redirect
    router.get('/', async (ctx: Context) => {
      return ctx.redirect('/cms');
    });

    this.router = router;
  }

  public mount(rootRouter: Router) {
    rootRouter.use(this.router.routes());
  }

  // logger
  public setLogger(logger: Logger) {
    this.logger = logger;
  };

  public getLogger(): Logger {
    return this.logger;
  }
}
