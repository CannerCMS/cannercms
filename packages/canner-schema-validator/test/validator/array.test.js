import Validator from '../../src';

describe('array table', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'table'
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('array tableRoute', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'tableRoute'
    });
    expect(validator.validate()).toBe(true);
  });

  test('ui tableRoute only can be one level', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'tableRoute',
      path: 'info/posts'
    })
    expect(validator.validate()).toBe(false);
  });
});


describe('array gallery', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'gallery'
    });
    expect(validator.validate()).toBe(true);
  });
});


describe('array panel', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'panel'
    });
    expect(validator.validate()).toBe(true);
  });
});


describe('array slider', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'slider'
    });
    expect(validator.validate()).toBe(true);
  });
});


describe('array tab', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'tab'
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('array tree', () => {
  it('should be invalid with no other fields', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'tree'
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no uiParams.textCol', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'tree',
      uiParams: {
        textCol: 'any'
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'tree',
      uiParams: {
        textCol: 'any',
        relationField: 'any'
      }
    });
    expect(validator.validate()).toBe(true);
  });

  test('ui tree only can be one level', () => {
    const validator = new Validator({
      type: 'array',
      ui: 'tree',
      path: 'info/posts'
    })
    expect(validator.validate()).toBe(false);
  });
});