import Validator from '../../src';

describe('geoPoint default', () => {
  it('should be valid with no other fields', () => {
    const validator = new Validator({
      type: 'geoPoint',
      ui: 'default'
    });
    expect(validator.validate()).toBe(true);
  });
});