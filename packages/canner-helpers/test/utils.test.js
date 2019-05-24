import { genDefaultValue } from '../src/utils';

describe('genDefaultValue', () => {
  it('should return value with given string', () => {
    const defaultValue = 'value';
    expect(genDefaultValue(defaultValue)).toBe(defaultValue);
  });

  it('should retrun value with given funciton', () => {
    const defaultValue = () => 'value';
    expect(genDefaultValue(defaultValue)).toBe(defaultValue());
  });
});
