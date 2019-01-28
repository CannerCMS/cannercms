import { Context } from 'koa';
import { URL } from 'url';
import jose from 'node-jose';
import Boom from 'boom';
import { defaultTo, isArray, get } from 'lodash';
import { usernameCookieKey, accessTokenCookieKey, idTokenCookieKey, defaultUsernameClaim } from '../constants';
import { Issuer } from 'openid-client';
import { Token } from './token';

interface IssuerConfig {
  issuer?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  jwksUri?: string;
}

export class OidcHandler {
  private verifier: {
    verify: (accessToken: string) => Promise<any>
  };
  private usernameClaim: string;
  private oidcScopes: string;
  private forceSsoLogout: boolean;

  // issuer
  // via Discovery
  private discoveryUrl?: string;
  // manually
  private issuerConfig?: IssuerConfig;

  // client
  private clientId?: string;
  private clientSecret?: string;
  private oidcClient: any;
  private redirectUri: string;

  // logout
  private ssoLogout: (ctx: Context) => Promise<void>;

  constructor({
    redirectUri,
    usernameClaim,
    additionalScopes,
    forceSsoLogout,
    discoveryUrl,
    issuerConfig,
    clientId,
    clientSecret,
    ssoLogout,
  }: {
    redirectUri: string,
    usernameClaim?: string
    additionalScopes?: string[],
    forceSsoLogout?: boolean,
    discoveryUrl?: string,
    issuerConfig?: IssuerConfig,
    clientId?: string,
    clientSecret?: string,
    ssoLogout?: (ctx: Context) => Promise<void>,
  }) {
    this.usernameClaim = usernameClaim || defaultUsernameClaim;
    this.oidcScopes = isArray(additionalScopes)
      ? ['openid'].concat(additionalScopes).join(' ')
      : 'openid';
    this.forceSsoLogout = defaultTo(forceSsoLogout, true);

    // oidc config
    this.discoveryUrl = discoveryUrl;
    this.issuerConfig = issuerConfig;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.ssoLogout = ssoLogout;
  }

  public async initialize() {
    // construct issuer
    const issuer = (this.discoveryUrl)
      ? await Issuer.discover(this.discoveryUrl)
      : new Issuer(this.issuerConfig);

    // construct jose verify
    const keystore = await issuer.keystore();
    this.verifier = jose.JWS.createVerify(keystore);

    // construct client
    this.oidcClient = new issuer.Client({
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
  }

  public beforeRenderCms = async (ctx: Context, next) => {
    const accessToken = ctx.cookies.get(accessTokenCookieKey, {signed: true});

    if (!accessToken) {
      // redirect to login page
      const loginUrl = this.getLoginUrl();
      return ctx.redirect(loginUrl);
    }

    try {
      await this.verifier.verify(accessToken);
    } catch (err) {
      throw Boom.unauthorized(err.message);
    }

    // token verified
    return next();
  }

  public authCallback = async (ctx: Context, next) => {
    const query = ctx.query;
    const redirectUri = this.redirectUri;
    const tokenSet = await this.oidcClient.authorizationCallback(redirectUri, query);
    const accessToken = new Token(tokenSet.access_token);

    // assign to cookie
    const username = get(accessToken.getContent(), this.usernameClaim);
    if (username) {
      ctx.cookies.set(usernameCookieKey, username, {signed: true});
    }
    ctx.cookies.set(accessTokenCookieKey, tokenSet.access_token, {signed: true});
    ctx.cookies.set(idTokenCookieKey, tokenSet.id_token, {signed: true});

    // go to next by default, which would simply redirect to /cms
    return next();
  }

  public logout = async (ctx: Context, next: () => Promise<any>) => {
    const idToken = ctx.cookies.get(idTokenCookieKey, {signed: true});
    // kill cookies
    ctx.cookies.set(usernameCookieKey, null);
    ctx.cookies.set(accessTokenCookieKey, null);
    ctx.cookies.set(idTokenCookieKey, null);

    // if we don't need to logout from SSO, simply go to next
    // which would redirect to /cms
    if (!this.forceSsoLogout) {
      return next();
    }

    // by default, we do a RP-initiated logout here
    // if ssoLogout specified (for auth0, okta, or other providers), do it instead
    // https://openid.net/specs/openid-connect-session-1_0.html#RPLogout

    if (this.ssoLogout) {
      return this.ssoLogout(ctx);
    } else {
      // RPLogout
      const logoutUrl = this.oidcClient.endSessionUrl({
        post_logout_redirect_uri: 'http://localhost:3000/',
        id_token_hint: idToken,
      });
      return ctx.redirect(logoutUrl);
    }
  }

  private buildBackPath = (currentUrl?: string) => {
    if (!currentUrl) {
      return null;
    }
    const url = new URL(currentUrl);
    return encodeURIComponent(url.pathname + url.search);
  }

  private getLoginUrl = () => {
    const redirectUri = this.redirectUri;
    const loginUrl = this.oidcClient.authorizationUrl({
      redirect_uri: redirectUri,
      scope: this.oidcScopes,
    });
    return loginUrl;
  }
}
