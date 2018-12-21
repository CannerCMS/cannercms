import Validator from '../../src';

describe('number input', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'number',
      ui: 'input'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'number',
      ui: 'input',
      uiParams: {
        min: 0,
        max: 100,
        step: 1,
        precision: 0,
        unit: '$',
        formmater: function() {},
        parser: function() {},
      }
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('number rate', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'number',
      ui: 'rate'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'number',
      ui: 'rate',
      uiParams: {
        allowHalf: true,
        count: 5
      }
    });
    expect(validator.validate()).toBe(true);
  });
});


describe('number slider', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'number',
      ui: 'slider'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'number',
      ui: 'slider',
      uiParams: {
        min: 0,
        max: 100,
        step: 1,
        unit: '$',
      }
    });
    expect(validator.validate()).toBe(true);
  });
});