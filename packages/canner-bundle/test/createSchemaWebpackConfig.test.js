import {
  createSchemaConfig,
} from '../src/utils/createWebpackConfig';

describe('createSchemaConfig', () => {
  const config = createSchemaConfig({
    schemaPath: 'schemaPath',
    schemaOutputPath: 'schemaOutputPath',
    resolveModules: 'resolveModules',
    resolveLoaderModules: 'resolveLoaderModules',
    tsConfigFile: 'tsConfigFile',
    plugins: ['plugins'],
    watch: true,
    devMode: true,
  });
  it('default schema config', () => {
    expect(config).toMatchSnapshot();
  });
});
