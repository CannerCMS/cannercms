import { createApp } from '../app';	
import minimist from 'minimist';
import path from 'path';
const argv = minimist(process.argv.slice(2));

resolveFlag({
  shortName: 'c',
  normalName: 'config',
  defaultValue: path.resolve(process.cwd(), 'canner.server.js'),
});

const config = require(argv.config);
const port = process.env.NODE_PORT || 3000;	

createApp(config).then(app => {	
  app.listen(port, () => {	
    // tslint:disable-next-line:no-console	
    console.log(`	
      start server	
    `);	
  });	
})	
// tslint:disable-next-line:no-console	
.catch(console.error);

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