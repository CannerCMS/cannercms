import {
  RenderPageOptions,
  renderPlaygroundPage,
} from 'graphql-playground-html';
import { Context } from 'koa';
import { Issuer } from 'openid-client';
import { IssuerConfig } from '@canner/server-common/lib/oidcTokenVerifier';
import { isEmpty, get } from 'lodash';
import querystring from 'querystring';

// This specifies the version of `graphql-playground-react` that will be served
// from `graphql-playground-html`.  It's passed to ``graphql-playground-html`'s
// renderPlaygroundPage` via the integration packages' playground configuration.
const playgroundVersion = '1.7.10';

// https://stackoverflow.com/a/51365037
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
};

export type PlaygroundConfig = RecursivePartial<RenderPageOptions>;

const defaultPlaygroundOptions = {
  version: playgroundVersion,
  settings: {
    'general.betaUpdates': false,
    'editor.theme': 'dark',
    'editor.cursorShape': 'line',
    'editor.reuseHeaders': true,
    'tracing.hideTracingResponse': true,
    'editor.fontSize': 14,
    'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
    'request.credentials': 'omit',
  },
};

export const createMiddleware = (
  createOptionsFromCtx: (ctx: Context) => PlaygroundConfig,
) => {
  return async (ctx: Context, next) => {
    if (ctx.path !== '/playground' || ctx.method !== 'GET') {
      return next();
    }

    try {
      const optionsFromCtx = createOptionsFromCtx(ctx);
      const options = {
        ...defaultPlaygroundOptions,
        ...optionsFromCtx,
      };
      ctx.body = await renderPlaygroundPage(options as RenderPageOptions);
    } catch (err) {
      ctx.body = { message: err.message };
      ctx.status = err.status || 500;
    }
  };
};

export interface GraphqlPlaygroundOidcConfig {
  discoveryUrl?: string;
  issuerConfig?: IssuerConfig;
  clientId?: string;
  clientSecret?: string;
}

export class GraphqlPlaygroundUrlFactory {
  private oidc: GraphqlPlaygroundOidcConfig;
  private playgroundUrl: string;
  private issuer: Issuer;
  private oidcClient: any;

  constructor(option: {
    playgroundUrl: string,
    oidc?: GraphqlPlaygroundOidcConfig
  }) {
    this.oidc = option.oidc;
    this.playgroundUrl = option.playgroundUrl;
  }

  public getUrl = async () => {
    if (!this.oidc) {
      // public accessible graphql playgroundUrl
      return this.playgroundUrl;
    }

    // get accessToken with clientCredential
    const oidcClient = await this.getOidcClient();
    const tokenSet = await oidcClient.grant({
      grant_type: 'client_credentials'
    });
    const accessToken = tokenSet.access_token;

    // put to graphql playground url
    const query = querystring.stringify({
      headers: JSON.stringify({
        Authorization: accessToken,
      }),
    });
    return `${this.playgroundUrl}?${query}`;
  }

  private getIssuer = async () => {
    if (this.issuer) {
      return this.issuer;
    }

    const issuerConfig = get(this.oidc, 'issuerConfig');
    const discoveryUrl = get(this.oidc, 'discoveryUrl');
    this.issuer = (!isEmpty(issuerConfig))
      ? new Issuer(issuerConfig)
      : await Issuer.discover(discoveryUrl);
    return this.issuer;
  }

  private getOidcClient = async () => {
    if (this.oidcClient) {
      return this.oidcClient;
    }

    // construct issuer
    const issuer = await this.getIssuer();

    // construct client
    const clientId = get(this.oidc, 'clientId');
    const clientSecret = get(this.oidc, 'clientSecret');
    this.oidcClient = new issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
    });

    return this.oidcClient;
  }
}
