#!/usr/bin/env node

import {build} from '../index';
import path from 'path';
import minimist from 'minimist';
import Webpackbar from 'webpackbar';
import {WEB_OUTPUT_PATH, SCHEMA_OUTPUT_PATH, } from '../config';

const argv = minimist(process.argv.slice(2));
const global = argv.global;

resolveFlag({
  shortName: 'c',
  normalName: 'config',
  defaultValue: path.resolve(process.cwd(), 'canner.server.js'),
});

resolveFlag({
  shortName: 's',
  normalName: 'schema',
  defaultValue: path.resolve(process.cwd(), 'canner.schema.js'),
})

resolveFlag({
  shortName: 'o',
  normalName: 'output',
  defaultValue: WEB_OUTPUT_PATH,
});

resolveFlag({
  shortName: 'O',
  normalName: 'schemaOutput',
  defaultValue: '',
});

build({
  webOutputPath: argv.output,
  schemaJsonOutputPath: argv.schemaOutput,
  schemaPath: argv.schema,
  cmsConfig: global ? require(argv.config) : {},
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

function resolveFlag({shortName, normalName, defaultValue}) {
  if (argv[normalName]) {
    argv[normalName] = path.resolve(process.cwd(), argv[normalName]);
    return;
  }
  if (argv[shortName]) {
    argv[normalName] = path.resolve(process.cwd(), argv[shortName]);
  } else {
    argv[normalName] = defaultValue;
  }
}