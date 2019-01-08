import { createApp } from '../app';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
if (!argv.schema) {
  console.log('Please use --schema=<path> give canner.schema.js path')
}

createApp({ schemaPath: argv.schema })
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