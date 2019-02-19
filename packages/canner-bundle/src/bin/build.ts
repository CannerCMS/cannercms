#!/usr/bin/env node

import {build} from '../index';
import path from 'path';
import minimist from 'minimist';
import Webpackbar from 'webpackbar';
import {WEB_OUTPUT_PATH, SCHEMA_OUTPUT_PATH} from '../config';

const argv = minimist(process.argv.slice(2));
if (!argv.schema) {
  console.log(`No option --schema=<path>, use default path ${SCHEMA_OUTPUT_PATH}`)
}

if (!argv.output) {
  console.log(`No option --output=<path>, use default path ${WEB_OUTPUT_PATH}`)
}

const global = argv.global;

build({
  webOutputPath: argv.output && path.resolve(process.cwd(), argv.output),
  schemaJsonOutputPath: argv.schema && path.resolve(process.cwd(), argv.schema),
  webOnly: argv.webOnly,
  schemaOnly: argv.schemaOnly,
  resolveModules: global ? [
    path.resolve(__dirname, '../../node_modules')
  ] : [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../../../node_modules')
  ],
  resolveLoaderModules: global ? [
    path.resolve(__dirname, '../../node_modules')
  ] : [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../../../node_modules')
  ],
  tsConfigFile: global ? path.resolve(__dirname, '../../tsconfig.global.json') : undefined,
  schemaPlugins: global ? [new Webpackbar({name: 'Bundle Schema'})] : [],
  webPlugins: global ? [new Webpackbar({name: 'Bundle CMS'})] : []
})
  .then((stats: any) => {
    console.log('finished', stats.toString({
      assets: true,
      colors: true,
      version: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      children: false
    }));
  })
  .catch(err => {
    console.log('error', err);
  });
