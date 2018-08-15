import CannerRefId from '../src';


describe('Create a RefId object', function() {
  it('should parse initial value', function() {
    const initRef = new CannerRefId("init/0")
    expect(initRef.getPathArr()).toEqual(['init', '0'])
  });

  it('should transform to id string', function() {
    const initRef = new CannerRefId("init/0")
    expect(initRef.toString()).toEqual("init/0")
  });

  it('should parse empty string', function() {
    const initRef = new CannerRefId("")
    expect(initRef.getPathArr()).toEqual([])
  });
});

describe('Append children', function() {
  it('should append a child in the end', function() {
    const initRef = new CannerRefId("init/0")
    expect(initRef.child('test').getPathArr()).toEqual(['init', '0', 'test'])
  });

  it('should append a route', function() {
    const initRef = new CannerRefId("init/0")
    expect(initRef.child('test/1').getPathArr()).toEqual(['init', '0', 'test', '1'])
  });
});

describe('Remove children', function() {
  it('should remove a child in the end', function() {
    const initRef = new CannerRefId("init/0")
    expect(initRef.remove().getPathArr()).toEqual(['init'])
  });

  it('should remove a two children', function() {
    const initRef = new CannerRefId("init/0")
    expect(initRef.remove(2).getPathArr()).toEqual([])
  });

  it('should remove a two children', function() {
    const initRef = new CannerRefId("init/0/test/2")
    expect(initRef.remove(2).getPathArr()).toEqual(["init", "0"])
  });
});

describe('Mixed test', function() {
  it('should train all methods together', function() {
    const refId = new CannerRefId("route/0");

    // result: route/0/test/0
    const refString = refId
      .child("test")
      .child("0/1")
      .remove()
      .toString()

    expect(refString).toEqual("route/0/test/0")
  })
});

describe('Immutable', function() {
  it('should get different instances of RefId after child()', function() {
    const refId = new CannerRefId("route/0");
    const refId2 = refId.child("title");
    expect(refId).not.toEqual(refId2);
    expect(refId.getPathArr()).toEqual(["route", "0"]);
    expect(refId2.getPathArr()).toEqual(["route", "0", "title"]);
  });

  it('should get different instances of RefId after remove()', function() {
    const refId = new CannerRefId("route/0");
    const refId2 = refId.remove();
    expect(refId).not.toEqual(refId2);
    expect(refId.getPathArr()).toEqual(["route", "0"]);
    expect(refId2.getPathArr()).toEqual(["route"]);
  });
});

describe('Empty String', function() {
  it('should get empty array and empty string', function() {
    const refId = new CannerRefId("");
    expect(refId.getPathArr().length).toBe(0);
    expect(refId.toString()).toBe('');
  });

  it('child() should works', () => {
    const refId = new CannerRefId("");
    const refId2 = refId.child('child');
    expect(refId2.getPathArr().length).toBe(1);
    expect(refId2.toString()).toBe('child');
  })
});
