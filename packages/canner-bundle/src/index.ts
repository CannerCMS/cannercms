import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {createConfig, CreateConfigArgsType, createWebConfig, createSchemaConfig} from './utils/createWebpackConfig';
import transformSchemaToJson from './utils/transformSchemaToJSON';
import {SCHEMA_OUTPUT_PATH, SCHEMA_JSON_OUTPUT_PATH} from './config';
export function build(options?: CreateConfigArgsType) {
  const config = createConfig(options || {});
  return new Promise((resolve, reject) => {
    webpack(config)
      .run((err: any, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            return reject(err.details);
          }
        }
      
        const info = stats.toJson();
      
        if (stats.hasErrors()) {
          return reject(info.errors);
        }
        if (!options.webOnly) {
          const schemaPath = `${(options || {}).schemaOutputPath || SCHEMA_OUTPUT_PATH}/schema.node.js`;
          transformSchemaToJson(schemaPath, (options || {}).schemaJsonOutputPath || SCHEMA_JSON_OUTPUT_PATH);
        }
        resolve(stats);
      });
  });
}

export function watchSchema(options: CreateConfigArgsType, callback: any) {
  if (options && !options.watch) {
    options.watch = true;
  }
  const config = createSchemaConfig(options || {});
  const watchOptions = typeof config.watch === 'object'?
    config.watch :
    {
      aggregateTimeout: 300,
    };
  return webpack(config)
    .watch(watchOptions, (err, stats) => {
      const schemaPath = `${(options || {}).schemaOutputPath || SCHEMA_OUTPUT_PATH}/schema.node.js`;
      transformSchemaToJson(schemaPath, (options || {}).schemaJsonOutputPath || SCHEMA_JSON_OUTPUT_PATH);
      callback(err, stats);
    });
}

export function serve(options: CreateConfigArgsType, callback: any) {
  if (options) {
    options.watch = true;
  }
  const config = createWebConfig(options || {});
  const compiler = webpack(config);
  const devServerOptions = {...config.devServer};
  const server = new WebpackDevServer(compiler, devServerOptions);
  server.listen(config.devServer.port, '127.0.0.1', () => {});
  return server;
}
