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
  schemaJsonOutputPath: argv.schema && path.resolve(process.cwd(), argv.schema),
  plugins: argv.global ? [new Webpackbar({name: 'Watch Schema'})] : [],
  devMode: true
}, (err, stats) => {
  console.log(stats.toString());
});