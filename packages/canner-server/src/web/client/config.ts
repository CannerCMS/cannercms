import path from 'path';

export const HTML_PATH = path.join(__dirname, './statics/index.html');
export const SCHEMA_PATH = path.join(__dirname, './statics/schema/canner.schema.js');
export const SCHEMA_OUTPUT_PATH = path.join(__dirname, '../dist');
export const WEB_OUTPUT_PATH = path.join(__dirname, '../dist');
export const SCHEMA_ONLY = process.env.SCHEMA_ONLY;
export const WEB_ONLY = process.env.WEB_ONLY;
