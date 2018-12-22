import Validator from '../../src';

describe('root top level', () => {
  test('schema can be empty', () => {
    const validator = new Validator({
    }, {isRoot: true})
    expect(validator.validate()).toBe(true);
  });

  test('first level can be object', () => {
    const validator = new Validator({
      info: {
        type: 'object',
      }
    }, {isRoot: true})
    expect(validator.validate()).toBe(true);
  });

  test('first level can be array', () => {
    const validator = new Validator({
      posts: {
        type: 'array',
      },
    }, {isRoot: true})
    expect(validator.validate()).toBe(true);
  });

  test('first level can be page', () => {
    const validator = new Validator({
      dashboard: {
        type: 'page',
      },
    }, {isRoot: true})
    expect(validator.validate()).toBe(true);
  });

  test('first level can not be others', () => {
    const validator = new Validator({
      info: {
        type: 'string',
      },
    }, {isRoot: true})
    expect(validator.validate()).toBe(false);
  });
})