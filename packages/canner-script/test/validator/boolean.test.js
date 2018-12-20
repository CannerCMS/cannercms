import Validator from '../../src/validator';

describe('Boolean Card', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'boolean',
      ui: 'card'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'boolean',
      ui: 'card',
      uiParams: {
        yesText: 'YES',
        noText: 'NO'
      }
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('Boolean Switch', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'boolean',
      ui: 'switch'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'boolean',
      ui: 'switch',
      uiParams: {
        yesText: 'YES',
        noText: 'NO'
      }
    });
    expect(validator.validate()).toBe(true);
  });
});