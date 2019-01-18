import {serve} from '../index';
import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));

serve({
  webOnly: argv.webOnly,
  schemaOnly: argv.schemaOnly,
})
  .then(stats => {
    console.log(stats.toString());
  })
  .catch(err => {
    console.log(err);
  });