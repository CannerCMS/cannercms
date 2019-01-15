import {Context} from 'koa';
import {isEmpty} from 'lodash';
import path from 'path';

export interface CmsServerConfig {
  staticsPath?: string;
  clientBundledDir: string;
  beforeRenderCms?: (ctx: Context) => Promise<void>;
  authCallback?: (ctx: Context) => Promise<void>;
  logout?: (ctx: Context) => Promise<void>;
}

const defaultServerConfig = {
  staticsPath: '/public',
  clientBundledDir: path.join(process.cwd(), '.cms'),
}

export const createConfig = (customConfig?: CmsServerConfig): CmsServerConfig => {
  const mergedConfig = {
    ...defaultServerConfig,
    ...customConfig,
  };

  return mergedConfig;
}
