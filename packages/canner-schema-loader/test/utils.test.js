import {absPackageName} from '../src/index';
import path from 'path';

describe('absPackageName', () => {
  it('should get abs packageName with given relation path', () => {
    const context=  {
      context: './'
    };
    const sourcePackageName = './customize-string-component';
    expect(absPackageName(sourcePackageName, context)).toBe(path.resolve(sourcePackageName));
  });

  it('should get abs packageName with given root path', () => {
    const context=  {
      context: './'
    };
    const sourcePackageName = '/Users/projects/customize-string-component';
    expect(absPackageName(sourcePackageName, context)).toBe(path.resolve(sourcePackageName));
  });

  it('should get abs packageName with given module name', () => {
    const context=  {
      context: './'
    };
    const sourcePackageName = '@canner/antd-string-input';
    expect(absPackageName(sourcePackageName, context)).toBe(path.resolve(require.resolve('@canner/antd-string-input'), '../../'));
  });
});
