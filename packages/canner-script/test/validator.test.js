import validator from '../src/validator';

describe('packageName', () => {
  it('should return true', () => {
    expect(validator.validatePackageName('antd-string')).toBe(true);
    expect(validator.validatePackageName('antd-number')).toBe(true);
    expect(validator.validatePackageName('antd-boolean')).toBe(true);
    expect(validator.validatePackageName('antd-array')).toBe(true);
    expect(validator.validatePackageName('antd-object')).toBe(true);
    expect(validator.validatePackageName('path/to/antd-object')).toBe(true);
    expect(validator.validatePackageName('vega-chart')).toBe(true);
  });

  it('should throw error', () => {
    expect(() => validator.validatePackageName('relation')).toThrow(/Invalid package name/);
  });
});

describe('cannerDataType', () => {
  it('should return true', () => {
    expect(validator.validateCannerDataType('string')).toBe(true);
    expect(validator.validateCannerDataType('number')).toBe(true);
    expect(validator.validateCannerDataType('boolean')).toBe(true);
    expect(validator.validateCannerDataType('array')).toBe(true);
    expect(validator.validateCannerDataType('object')).toBe(true);
    expect(validator.validateCannerDataType('relation')).toBe(true);
    expect(validator.validateCannerDataType('dateTime')).toBe(true);
    expect(validator.validateCannerDataType('geoPoint')).toBe(true);
    expect(validator.validateCannerDataType('file')).toBe(true);
    expect(validator.validateCannerDataType('image')).toBe(true);
    expect(validator.validateCannerDataType('chart')).toBe(true);
  });

  it('should throw error', () => {
    expect(() => validator.validateCannerDataType('haha')).toThrow(/Invalid canner data type/);
  });
});

describe('setConfig', () => {
  it('should change throwError', () => {
    validator.throwError = true;
    validator.setConfig({
      throwError: false
    });
    expect(validator.throwError).toBe(false);
  });

  it('should not add any new config', () => {
    validator.setConfig({
      haha: true
    });
    expect(validator.haha).toBeUndefined();
  })
});

describe('invalid', () => {
  it('should throw', () => {
    validator.throwError = true;
    expect(validator.invalid).toThrow();
  });

  it('should return false', () => {
    validator.throwError = false;
    expect(validator.invalid()).toBe(false);
  })
});
