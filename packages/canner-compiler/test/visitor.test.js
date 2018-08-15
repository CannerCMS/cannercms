import Visitor from '../src/visitor';

const visitor = new Visitor();

describe('visitor', function() {
  it('merge visitor', function() {
    visitor.merge({
      name: () => {},
    });
    expect(visitor.getVisitor().name.enter.length).toBe(1);
    expect(visitor.getVisitor().name.exit.length).toBe(0);
  });

  it('visitor enter', function() {
    const fn = jest.fn();
    const times = 5;
    for (let i = times; i > 0; i--) {
      visitor.merge({
        test: fn,
      });
    }
    visitor.getVisitor().test.enter.forEach((func) => func());
    expect(fn).toHaveBeenCalledTimes(times);
  });
});
