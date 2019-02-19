
import {
  createConfig
} from '../src/utils/createWebpackConfig';
import tmp from 'tmp';
jest.mock('tmp');
tmp.fileSync.mockReturnValue({
  name: 'file-name'
});
afterAll(() => {
  const fs = require('fs');
  if (fs.existsSync('file-name')) {
    fs.unlinkSync('file-name');
  }
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
    schemaPlugins: ['schemaPlugins'],
    webPlugins: ['webPlugins'],
    i18nMessages :'i18nMessages',
  });
  it('webpack config', () => {
    expect(config).toMatchSnapshot();
  });
});
