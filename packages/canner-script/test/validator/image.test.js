import Validator from '../../src/validator';

describe('image image', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'image',
      ui: 'image'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'image',
      ui: 'image',
      uiParams: {
        filename: 'filename',
        dirname: 'dirname',
        limitSize: 6000
      }
    });
    expect(validator.validate()).toBe(true);
  });
});