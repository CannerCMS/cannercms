import Validator from '../src/index';
import ecommerce from './schemas/ecommerce.json';

describe('schema validator', () => {
  test('ecommerce schema', () => {
    const validator = new Validator(ecommerce, true);
    expect(validator.validate(validator)).toBeTruthy();
  });
})