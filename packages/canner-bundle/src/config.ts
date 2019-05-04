import path from 'path';
export const APP_PATH = path.join(__dirname, './statics/App');
export const HTML_PATH = path.join(__dirname, './statics/index.html');
export const SCHEMA_PATH = path.join(__dirname, './statics/schema/canner.schema.js');
export const SCHEMA_OUTPUT_PATH = process.cwd();
export const SCHEMA_OUTPUT_FILENAME = 'schema.node.js';
export const WEB_OUTPUT_PATH = path.join(process.cwd(), '.cms');
export const SCHEMA_ONLY = process.env.SCHEMA_ONLY;
export const WEB_ONLY = process.env.WEB_ONLY;
export const CMS_CONFIG = {
  style: {},
  sidebarMenu: []
};
export const AUTH_PATH = path.join(__dirname, './statics/default.canner.auth.ts');
export const RESOLVE_MODULES = ['node_modules'];
export const RESOLVE_LOADER_MODULES = ['node_modules'];
export const TS_CONFIG_FILE = path.join(__dirname, '../../../tsconfig.json');
export const SCHEMA_JSON_OUTPUT_PATH = path.join(process.cwd(), 'canner.schema.json');
export const DATA_SOURCE_PATH = path.join(process.cwd(), 'canner.dataSources.json');