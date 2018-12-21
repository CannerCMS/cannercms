import Validator from '../../src';

describe('root top level', () => {
  test('schema can be empty', () => {
    const validator = new Validator({
    })
    expect(validator.validate()).toBe(true);
  });

  test('first level can be object', () => {
    const validator = new Validator({
      info: {
        type: 'object',
      }
    })
    expect(validator.validate()).toBe(true);
  });

  test('first level can be array', () => {
    const validator = new Validator({
      posts: {
        type: 'array',
      },
    })
    expect(validator.validate()).toBe(true);
  });

  test('first level can be page', () => {
    const validator = new Validator({
      dashboard: {
        type: 'page',
      },
    })
    expect(validator.validate()).toBe(true);
  });

  test('first level can not be others', () => {
    const validator = new Validator({
      info: {
        type: 'string',
      },
    })
    expect(validator.validate()).toBe(false);
  });
})