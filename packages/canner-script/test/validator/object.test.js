import Validator from '../../src/validator';

describe('object editor', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'object',
      ui: 'editor'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'object',
      ui: 'editor',
      uiParams: {
        minHeight: 600
      }
    });
    expect(validator.validate()).toBe(true);
  });
});


describe('object options', () => {
  it('should be invalid with no other fields', () => {
    const validator = new Validator({
      type: 'object',
      ui: 'options'
    });
    expect(validator.validate()).toBe(false);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'object',
      ui: 'options',
      uiParams: {
        selectedKey: 'test',
        options: [{
          title: 'test',
          key: 'test'
        }, {
          title: 'test',
          key: 'test'
        }]
      }
    });
    expect(validator.validate()).toBe(true);
  });

  it('should be invalid with unexpected uiParams.options', () => {
    const validator = new Validator({
      type: 'object',
      ui: 'options',
      uiParams: {
        selectedKey: 'test',
        options: []
      }
    });
    expect(validator.validate()).toBe(false);
  });
});