import {isEmpty} from 'lodash';
import path from 'path';

export interface Config {
  env: string;
  appPrefix: string;
  staticsPath: string;
}

const sanitizePath = (path: string) => {
  if (isEmpty(path) || path === '/') {
    return null;
  }
  path = path.startsWith('/') ? path : `/${path}`;
  path = path.endsWith('/') ? path.slice(0, -1) : path;
  return path;
};

export const createConfig = (): Config => {
  const env = process.env.NODE_ENV || 'development';
  switch (env) {
    case 'production':
      return {
        env: 'production',
        appPrefix: sanitizePath(process.env.APP_PREFIX),
        staticsPath: path.join(process.cwd(), '.cms')
      };
    default:
      return {
        env: 'development',
        appPrefix: sanitizePath(process.env.APP_PREFIX),
        staticsPath: path.join(process.cwd(), '.cms')
      };
  }
}