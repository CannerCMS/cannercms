import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {createConfig, CreateConfigArgsType, createWebConfig} from './utils/createWebpackConfig';

export function build(options?: CreateConfigArgsType) {
  const config = createConfig(options || {});
  return new Promise((resolve, reject) => {
    webpack(config)
      .run((err: any, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          return;
        }
      
        const info = stats.toJson();
      
        if (stats.hasErrors()) {
          console.error(info.errors);
        }
        resolve(stats);
      });
  });
}

export function serve(options?: CreateConfigArgsType) {
  const config = createWebConfig(options || {});
  const compiler = webpack(config);
  const devServerOptions = {...config.devServer};
  const server = new WebpackDevServer(compiler, devServerOptions);
  server.listen(config.devServer.port, '127.0.0.1', () => {
    console.log(`Starting server on http://localhost:${config.devServer.port}`);
  });
  return new Promise((resolve, reject) => {
    webpack(config)
      .watch({}, (err, stats) => {
        if (err || stats.hasErrors()) {
          return reject(err);
        }
        resolve(stats);
      });
  });
}
