import { Context } from 'koa';
import { URL } from 'url';
import jose from 'node-jose';
import Boom from 'boom';
import { defaultTo, isArray, get, isEmpty } from 'lodash';
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
  private keystore: any;
  private issuer: Issuer;
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
  private postLogoutRedirectUri: string;

  constructor({
    redirectUri,
    postLogoutRedirectUri,
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
    postLogoutRedirectUri: string,
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
    this.postLogoutRedirectUri = postLogoutRedirectUri;
  }

  public beforeRenderCms = async (ctx: Context, next) => {
    const accessToken = ctx.cookies.get(accessTokenCookieKey, {signed: true});
    const gotoLogin = async () => {
      const loginUrl = await this.getLoginUrl();
      return ctx.redirect(loginUrl);
    };

    if (!accessToken) {
      // redirect to login page
      return gotoLogin();
    }

    try {
      // construct jose verify
      await this.verify(accessToken);
    } catch (err) {
      throw Boom.unauthorized(err.message);
    }

    // check expired
    if (new Token(accessToken).isExpired()) {
      // expired, go to login page
      return gotoLogin();
    }

    // token verified
    return next();
  }

  public authCallback = async (ctx: Context, next) => {
    const oidcClient = await this.getOidcClient();
    const query = ctx.query;
    const redirectUri = this.redirectUri;
    const tokenSet = await oidcClient.authorizationCallback(redirectUri, query);
    const idToken = new Token(tokenSet.id_token);

    // assign to cookie
    const username = get(idToken.getContent(), this.usernameClaim);
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
      const oidcClient = await this.getOidcClient();
      const logoutUrl = oidcClient.endSessionUrl({
        post_logout_redirect_uri: this.postLogoutRedirectUri,
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

  private getLoginUrl = async () => {
    const oidcClient = await this.getOidcClient();
    const redirectUri = this.redirectUri;
    const loginUrl = oidcClient.authorizationUrl({
      redirect_uri: redirectUri,
      scope: this.oidcScopes,
    });
    return loginUrl;
  }

  private verify = async (accessToken: string) => {
    let keystore = this.keystore;
    if (!keystore) {
      const issuer = await this.getIssuer();
      keystore = await issuer.keystore();
      this.keystore = keystore;
    }
    return jose.JWS.createVerify(keystore).verify(accessToken);
  }

  private getIssuer = async () => {
    if (this.issuer) {
      return this.issuer;
    }

    this.issuer = (!isEmpty(this.issuerConfig))
      ? new Issuer(this.issuerConfig)
      : await Issuer.discover(this.discoveryUrl);
    return this.issuer;
  }

  private getOidcClient = async () => {
    if (this.oidcClient) {
      return this.oidcClient;
    }

    // construct issuer
    const issuer = await this.getIssuer();

    // construct client
    this.oidcClient = new issuer.Client({
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    return this.oidcClient;
  }
}
