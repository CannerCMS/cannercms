import {createWebpackDevServer} from '../index';
import minimist from 'minimist';
import path from 'path';
const argv = minimist(process.argv.slice(2));

const {
  server,
  config
} = createWebpackDevServer({
  webOnly: argv.webOnly,
  schemaOnly: argv.schemaOnly,
  resolveModules: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../../../node_modules')
  ],
  watch: true,
  devMode: true
});

server.listen(config.devServer.port, '127.0.0.1');