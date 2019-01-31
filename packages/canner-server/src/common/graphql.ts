import Boom from 'boom';
import { OidcTokenVerifier, IssuerConfig } from './oidcTokenVerifier';
import { isNil, get } from 'lodash';
import { Token } from './token';

export interface Context {
  readOnly: boolean;
  accessToken: string;
  claim: any;
}

export const ErrorCodes = {
  MUTATION_IN_READONLY: 'MUTATION_IN_READONLY',
};

/**
 * createAuthHandler
 * 1. check if readOnlyAccessToken setup and equals to passed-in token
 * 2. check if verified with oidc public key
 * throw boom error if not authorized
 */

export const createAuthHandler = ({
  discoveryUrl,
  issuerConfig,
  readOnlyAccessToken,
}: {
  discoveryUrl: string,
  issuerConfig: IssuerConfig,
  readOnlyAccessToken: string,
}) => {
  const verifier = new OidcTokenVerifier({
    discoveryUrl,
    issuerConfig,
  });
  const readOnlyAccess = !isNil(readOnlyAccessToken);

  return async (accessToken: string) => {
    let readOnly = false;
    if (readOnlyAccess && accessToken === readOnlyAccessToken) {
      readOnly = true;
    }

    // check with verifier
    await verifier.verify(accessToken);

    return {
      readOnly,
      accessToken,
      claim: new Token(accessToken).getContent(),
    };
  };
};

export const readOnlyMiddleware = async (resolve, root, args, context: Context, info) => {
  const operationType = get(info, 'operation.operation');
  if (!context.readOnly || (context.readOnly && operationType === 'query')) {
    return resolve(root, args, context, info);
  }

  // readOnly true, but operation is one of mutation or subscription
  throw Boom.forbidden('Only query allowed in readonly request', {code: ErrorCodes.MUTATION_IN_READONLY});
};
