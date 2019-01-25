import fs from 'fs';
import minimist from 'minimist';
import path from 'path';
import {DATA_SOURCE_PATH, SCHEMA_JSON_OUTPUT_PATH} from '../config';

const argv = minimist(process.argv.slice(2));
if (!argv.schema) {
  console.log(`No option --schema=<path>, use default path ${SCHEMA_JSON_OUTPUT_PATH}`)
  argv.schema = SCHEMA_JSON_OUTPUT_PATH;
}

if (!argv.dataSources) {
  console.log(`No option --dataSources=<path>, use default path ${DATA_SOURCE_PATH}`);
  argv.dataSources = DATA_SOURCE_PATH;
}

const schema = require(path.resolve(process.cwd(), argv.schema));
const dataSources = {};
Object.keys(schema).forEach(key => {
  dataSources[key] = {
    type: 'memory'
  };
});

fs.writeFileSync(
  path.resolve(process.cwd(), argv.dataSources),
  JSON.stringify(dataSources, null, 2),
  'utf-8'
);