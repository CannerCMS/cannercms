import Validator from '../../src/validator';

describe('root top level', () => {
  test('schema can be empty', () => {
    const validator = new Validator({
      schema: {

      }
    })
    expect(validator.valiadate()).toBe(true);
  });

  test('first level can be object', () => {
    const validator = new Validator({
      schema: {
        info: {
          type: 'object',
        },
      }
    })
    expect(validator.validate()).toBe(true);
  });

  test('first level can be array', () => {
    const validator = new Validator({
      schema: {
        posts: {
          type: 'array',
        },
      }
    })
    expect(validator.validate()).toBe(true);
  });

  test('ui tableRoute only can be second level', () => {
    const validator = new Validator({
      schema: {
        info: {
          type: 'object',
          items: {
            posts: {
              type: 'array',
              ui: 'tableRoute'
            }
          }
        },
      }
    })
    expect(validator.validate()).toBe(false);
  });

  test('ui tableRoute only can be second level', () => {
    const validator = new Validator({
      schema: {
        info: {
          type: 'object',
          items: {
            posts: {
              type: 'array',
              ui: 'tableRoute'
            }
          }
        },
      }
    })
    expect(validator.validate()).toBe(false);
  });
})