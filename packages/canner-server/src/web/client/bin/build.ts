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
  schemaOutputPath: argv.schema && path.resolve(process.cwd(), argv.schema)
})
  .then(stats => {
    console.log('success', stats.toString());
  })
  .catch(err => {
    console.log('error', err);
  });