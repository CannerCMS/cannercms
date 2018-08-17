import {replaceTypeAndUItoPackageName} from '../src';

describe('type and ui to packageName', () => {
  it('should get default packageName', () => {
    const str = `
      builder('string', null);
    ` 
    expect(replaceTypeAndUItoPackageName(str)).toMatchSnapshot();
  });

  it('should get default packageName', () => {
    const str = `
      builder('string', {
        keyName: 'string'
      });
    ` 
    expect(replaceTypeAndUItoPackageName(str)).toMatchSnapshot();
  });

  it('should get select packageName', () => {
    const str = `
      builder('string', {
        keyName: 'string',
        ui: 'select'
      });
    ` 
    expect(replaceTypeAndUItoPackageName(str)).toMatchSnapshot();
  });

  it('should not change', () => {
    const str = `
      builder('string', {
        keyName: 'string',
        packageName: '/packages/select'
      });
    ` 
    expect(replaceTypeAndUItoPackageName(str)).toBe(str);
  });

  it('should get package name', () => {
    const str = `
      builder('object', {keyName: 'info'},
        builder('string', {
          keyName: 'string'
        });
      );
    ` 
    expect(replaceTypeAndUItoPackageName(str)).toMatchSnapshot();
  });

  it('should get package name', () => {
    const str = `
      builder('object', {keyName: 'info'},
        builder('string', null);
      );
    ` 
    expect(replaceTypeAndUItoPackageName(str)).toMatchSnapshot();
  });
});