import { createApp } from '../app';
import minimist from 'minimist';
import path from 'path';

const argv = minimist(process.argv.slice(2));
if (!argv.schema) {
  console.log('Please use --schema=<path> give canner.schema.json path')
}

if (!argv.dataSources) {
  console.log('Please use --dataSources=<path> give canner.dataSources.json path')
}

createApp({ schemaPath: argv.schema, dataSources: require(path.resolve(process.cwd(), argv.dataSources)) })
  .then(({ app }) => {
    return app.listen();
  })
  .then(({ url }) => {
    // tslint:disable-next-line:no-console
    console.log(`🚀 GQLify server ready at ${url}`);
  })
  .catch(err => {
    console.log(err);
  });