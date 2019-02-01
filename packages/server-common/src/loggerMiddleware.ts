import { Context } from 'koa';

// create middleware from canner logger interface
export const create = (logger: any) => {
  if (!logger || !logger.info) {
    throw new Error(`require logger with valid format`);
  }

  return async (ctx: Context, next) => {
    const startTime = new Date().getTime();
    const date = new Date().toISOString();

    await next();

    const responseTime = new Date().getTime() - startTime;

    logger.info({
      date,
      status: ctx.status,
      remoteAddress: ctx.ip,
      method: ctx.method,
      url: ctx.url,
      referrer: ctx.get('Referrer'),
      userAgent: ctx.get('user-agent'),
      responseTime,
    });
  };
};
