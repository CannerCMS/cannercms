import { createApp } from 'simple-oidc-server';
import koaMount from 'koa-mount';
import Koa from 'koa';
import { WebService, Logger } from '../common/interface';
import { AuthConfig } from './config';

export class AuthService implements WebService {
  private logger: Logger;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  public async mount(app: Koa) {
    const mountPath = this.config.mountPath;
    const config: AuthConfig = {
      ...this.config,
      appPrefix: `${mountPath}/`,
    };
    const authApp = await createApp(config);
    app.use(koaMount(mountPath, authApp));
  }
}
