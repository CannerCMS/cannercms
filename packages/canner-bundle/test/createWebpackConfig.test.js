
import tmp from 'tmp';
import path from 'path';
import {
  createConfig,
// eslint-disable-next-line
} from '../src/utils/createWebpackConfig';

jest.mock('tmp');
tmp.fileSync.mockReturnValue({
  name: 'file-name',
});
afterAll(() => {
// eslint-disable-next-line
  const fs = require('fs');
  if (fs.existsSync('file-name')) {
    fs.unlinkSync('file-name');
  }
});
const replacePath = path.resolve(__dirname, '../../..');
expect.addSnapshotSerializer({
  test: val => typeof val === 'string' && val.indexOf(replacePath) !== -1,
  print: val => val.replace(replacePath, ''),
});
describe('createBothConfig', () => {
  const config = createConfig({
    schemaOnly: false,
    webOnly: false,
    schemaPath: 'schemaPath',
    schemaOutputPath: 'schemaOutputPath',
    webOutputPath: 'webOutputPath',
    htmlPath: 'htmlPath',
    cmsConfig: 'cmsConfig',
    resolveModules: 'resolveModules',
    resolveLoaderModules: 'resolveLoaderModules',
    tsConfigFile: 'tsConfigFile',
    appPath: 'appPath',
    authPath: 'authPath',
    schemaPlugins: ['schemaPlugins'],
    webPlugins: ['webPlugins'],
    i18nMessages: 'i18nMessages',
  });
  it('webpack config', () => {
    expect(config).toMatchSnapshot();
  });
});
