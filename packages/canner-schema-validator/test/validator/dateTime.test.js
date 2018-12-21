import Validator from '../../src';

describe('dateTime dateTime', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'dateTime',
      ui: 'dateTime'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be valid with uiParams', () => {
    const validator = new Validator({
      type: 'dateTime',
      ui: 'dateTime',
      uiParams: {
        format: 'YYYY/MM/DD',
        output: 'epoch'
      }
    });
    expect(validator.validate()).toBe(true);
  });

  it('should be valid with incorrect uiParams', () => {
    const validator = new Validator({
      type: 'dateTime',
      ui: 'dateTime',
      uiParams: {
        format: 'YYYY/MM/DD',
        output: 'undexpectedValue'
      }
    });
    expect(validator.validate()).toBe(false);
  });
});