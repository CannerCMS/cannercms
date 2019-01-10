import {createApp} from '../app';
import * as logger from '../logger';
import minimist from 'minimist';
import path from 'path';

const argv = minimist(process.argv.slice(2));

if (!argv.port) {
  console.log('No option --port=<port>, use default port 3000');
  argv.port = 3000;
}

if (!argv.staticsPath) {
  console.log(`No option --staticsPath=<staticsPath>, use default path ${path.join(process.cwd(), '.cms')}`);
}

createApp({
  staticsPath: argv.staticsPath
}).then(({app, config}) => {
  app.listen(argv.port, () => {
    // tslint:disable-next-line:no-console
    console.log(`
      🚀 Server ready on port ${argv.port}
    `);
  });
})
.catch(err => {
  logger.error({
    component: logger.components.system,
    type: 'FAIL_START_SERVER',
    message: err.message,
    stack: err.stack
  });
});