import {
  createWebConfig
} from '../src/utils/createWebpackConfig';
import tmp from 'tmp';
import path from 'path';
jest.mock('tmp');
jest.mock('html-webpack-plugin');
jest.mock('../src/utils/createEntryFile');
jest.mock('../src/utils/createWindowVarsFile');
tmp.fileSync.mockReturnValue({
  name: 'file-name'
});
const replacePath = path.resolve(__dirname, '../../..');
expect.addSnapshotSerializer({
  test:(val) => typeof val === 'string' && val.indexOf(replacePath) !== -1,
  print:(val) => val.replace(replacePath, '')
});

afterAll(() => {
  const fs = require('fs');
  if (fs.existsSync('file-name')) {
    fs.unlinkSync('file-name');
  }
});

describe('createWebConfig', () => {
  const config = createWebConfig({
    webOutputPath: 'webOutputPath',
    htmlPath: 'htmlPath',
    schemaPath: 'schemaPath',
    cmsConfig: 'cmsConfig',
    resolveModules: 'resolveModules',
    resolveLoaderModules: 'resolveLoaderModules',
    tsConfigFile: 'tsConfigFile',
    appPath: 'appPath',
    authPath: 'authPath',
    baseUrl: 'baseUrl',
    i18nMessages: 'i18nMessages',
    plugins: ['plugins'],
    watch: true,
    devServerPort: 8080,
    devMode: true,
  });
  it('web config', () => {
    expect(config).toMatchSnapshot();
  });
});
