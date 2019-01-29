import { createApp } from 'simple-oidc-server';
import koaMount from 'koa-mount';
import Koa from 'koa';
import { WebService, Logger } from '../common/interface';
import { jsonLogger } from '../common/jsonLogger';
import { AuthConfig } from './config';

const mountPath = '/oidc';

export class AuthService implements WebService {
  private logger: Logger = jsonLogger;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  public async mount(app: Koa) {
    const config: AuthConfig = {
      ...this.config,
      appPrefix: `${mountPath}/`,
    };
    const authApp = await createApp(config);
    app.use(koaMount(mountPath, authApp));
  }

  public setLogger(logger: Logger): void {
    this.logger = logger;
  }

  public getLogger(): Logger {
    return this.logger;
  }
}
