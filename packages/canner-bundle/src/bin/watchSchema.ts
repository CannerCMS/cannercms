import {watchSchema} from '../index';
import minimist from 'minimist';
import path from 'path';
import Webpackbar from 'webpackbar';
const argv = minimist(process.argv.slice(2));

watchSchema({
  resolveModules: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../../../node_modules')
  ],
  plugins: global ? [new Webpackbar({name: 'Watch Schema'})] : [],
}, () => {});