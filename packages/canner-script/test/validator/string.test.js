import Validator from '../../src/validator';

describe('String Input', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'input'
    });
    expect(validator.validate()).toBe(true);
  });
  
  it('should be invalid with unexpected uiParams.size', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'input',
      uiParams: {
        size: 'middle'
      }
    });
    expect(validator.validate()).toBe(false);
  });
});

describe('String Card', () => {
  it('should be invalid with no uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'card'
    });
    expect(validator.validate()).toBe(false);
  });
  
  it('should be invalid with incorrect uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'card',
      uiParams: {
        options: [{
          title: 'test',
          value: 'test'
        }]
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'card',
      uiParams: {
        options: [{
          text: 'test',
          value: 'test'
        }]
      }
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('String link', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'link'
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('String Radio', () => {
  it('should be invalid with no uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'radio'
    });
    expect(validator.validate()).toBe(false);
  });
  
  it('should be invalid with incorrect uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'radio',
      uiParams: {
        options: [{
          title: 'test',
          value: 'test'
        }]
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'radio',
      uiParams: {
        options: [{
          text: 'test',
          value: 'test'
        }]
      }
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('String select', () => {
  it('should be invalid with no uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'select'
    });
    expect(validator.validate()).toBe(false);
  });
  
  it('should be invalid with incorrect uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'select',
      uiParams: {
        options: [{
          title: 'test',
          value: 'test'
        }]
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with uiParams.options', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'select',
      uiParams: {
        options: [{
          text: 'test',
          value: 'test'
        }]
      }
    });
    expect(validator.validate()).toBe(true);
  });
});


describe('String textarea', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'textarea'
    });
    expect(validator.validate()).toBe(true);
  });
});

describe('String timePicker', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'string',
      ui: 'time'
    });
    expect(validator.validate()).toBe(true);
  });
});
