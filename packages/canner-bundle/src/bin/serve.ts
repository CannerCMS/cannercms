import {createWebpackDevServer} from '../index';
import minimist from 'minimist';
import path from 'path';
import Webpackbar from 'webpackbar';
const argv = minimist(process.argv.slice(2));

const {
  server,
  compiler,
  config
} = createWebpackDevServer({
  resolveModules: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../../../node_modules')
  ],
  plugins: argv.global ? [new Webpackbar({name: 'Bundle CMS'})] : [],
  watch: true,
  devMode: true
});
server.listen(config.devServer.port, '127.0.0.1', () => {
  console.log(`Serve run on port ${config.devServer.port}`);
});