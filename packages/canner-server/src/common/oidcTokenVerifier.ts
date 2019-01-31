import jose from 'node-jose';
import Boom from 'boom';
import { Issuer } from 'openid-client';
import { Token } from './token';
import { isEmpty } from 'lodash';

export const ErrorCodes = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
};

export interface IssuerConfig {
  issuer?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  jwksUri?: string;
}

export class OidcTokenVerifier {
  private keystore: any;
  private issuer: Issuer;

  // issuer
  // via Discovery
  private discoveryUrl?: string;
  // manually
  private issuerConfig?: IssuerConfig;

  constructor({
    discoveryUrl,
    issuerConfig,
  }: {
    discoveryUrl?: string,
    issuerConfig?: IssuerConfig,
  }) {
    // oidc config
    this.discoveryUrl = discoveryUrl;
    this.issuerConfig = issuerConfig;
  }

  public verify = async (accessToken: string) => {
    const keystore = await this.getKeystore();
    await jose.JWS.createVerify(keystore).verify(accessToken);

    // check if token expired
    const token = new Token(accessToken);
    if (token.isExpired()) {
      throw Boom.forbidden('token expired', {code: ErrorCodes.TOKEN_EXPIRED});
    }
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

  private getKeystore = async () => {
    if (this.keystore) {
      return this.keystore;
    }

    const issuer = await this.getIssuer();
    this.keystore = await issuer.keystore();
    return this.keystore;
  }
}
