import {
  createSchemaConfig,
} from '../src/utils/createWebpackConfig';
import path from 'path';
const replacePath = path.resolve(__dirname, '../../..');
expect.addSnapshotSerializer({
  test:(val) => typeof val === 'string' && val.indexOf(replacePath) !== -1,
  print:(val) => val.replace(replacePath, '')
});
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
