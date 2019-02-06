import send from 'koa-send';
import assert = require('assert');
import { resolve } from 'path';

export default (mountPath: string, root: string) => {
  const opts: send.SendOptions = {gzip: true, index: false, root};

  assert(root, 'root directory is required to serve files');

  opts.root = resolve(root);

  const middleware = async (ctx, next) => {
    await next();

    if (ctx.method !== 'HEAD' && ctx.method !== 'GET') {
      return;
    }

    // response is already handled
    if (ctx.body != null || ctx.status !== 404) {
      return;
    }

    try {
      const path = ctx.path.replace(mountPath, '');
      await send(ctx, path, opts);
    } catch (err) {
      if (err.status !== 404) {
        throw err;
      }
    }
  };

  return {
    path: `${mountPath}/*`,
    middleware,
  };
};
