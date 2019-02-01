import { ApolloError } from 'apollo-server-koa';
import { get } from 'lodash';
import { Logger } from '@canner/server-common/lib/interface';

export const ErrorCodes = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  AUTH_HEADER_MISSING: 'AUTH_HEADER_MISSING',
  ACCESSTOKEN_MISSING: 'ACCESSTOKEN_MISSING',
};

export const apolloErrorHandler = (error: any, logger: Logger) => {
  let errorCode: string;
  let errorMessage: string;
  const extensions = error.extensions;
  const exception = extensions.exception;

  // error code override: BoomError > ApolloError > default internal error
  if (exception.isBoom && exception.data && exception.data.code) {
    errorCode = exception.data.code;
    errorMessage = get(exception, 'output.payload.message', 'internal server error');
  } else if (extensions.code) {
    // GraphqlError with code
    errorCode = extensions.code;
    errorMessage = error.message;
  } else {
    errorCode = ErrorCodes.INTERNAL_ERROR;
    errorMessage = 'internal server error';
  }

  // print error message and stacktrace
  logger.fatal({
    code: errorCode,
    stacktrace: get(exception, 'stacktrace', []).join('\n'),
  });

  return new ApolloError(errorMessage, errorCode);
};
