import {serve} from '../index';
import minimist from 'minimist';
import path from 'path';
const argv = minimist(process.argv.slice(2));

serve({
  webOnly: argv.webOnly,
  schemaOnly: argv.schemaOnly,
  resolveModules: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../../../node_modules')
  ],
  watch: true
}, (err, stats) => {
  console.log(stats.toString());
});