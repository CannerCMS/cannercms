#!/usr/bin/env node

import {build} from '../index';
import path from 'path';
import minimist from 'minimist';
import {WEB_OUTPUT_PATH, SCHEMA_OUTPUT_PATH} from '../config';

const argv = minimist(process.argv.slice(2));
if (!argv.schema) {
  console.log(`No option --schema=<path>, use default path ${SCHEMA_OUTPUT_PATH}`)
}

if (!argv.output) {
  console.log(`No option --output=<path>, use default path ${WEB_OUTPUT_PATH}`)
}

build({
  webOutputPath: argv.output && path.resolve(process.cwd(), argv.output),
  schemaJsonOutputPath: argv.schema && path.resolve(process.cwd(), argv.schema),
  webOnly: argv.webOnly,
  schemaOnly: argv.schemaOnly,
  resolveModules: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../../../node_modules')
  ]
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
