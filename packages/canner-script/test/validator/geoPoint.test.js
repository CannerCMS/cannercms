import Validator from '../../src/validator';

describe('geoPoint default', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'geoPoint',
      ui: 'default'
    });
    expect(validator.validate()).toBe(true);
  });
});