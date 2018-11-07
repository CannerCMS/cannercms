import {isCompleteContain, genPaths, getRenderType, RENDER_CHILDREN, RENDER_COMPONENT, RENDER_NULL} from '../../src/hocs/route';

describe('genPaths', () => {
  it('should works', () => {
    const pattern = 'array.object.array.string';
    const path = 'info/info/info';
    expect(genPaths(path, pattern)).toEqual(['info', '__ARRAY_INDEX__', 'info', 'info', '__ARRAY_INDEX__']);
  })
});

describe('isCompelete', () => {
  it('should fail', () => {
    const paths = ['info', 'name'];
    const routes = ['info', 'hi'];
    expect(isCompleteContain(paths, routes)).toBeFalsy();
  });

  it('should true', () => {
    const paths = ['info', '__ARRAY_INDEX__'];
    const routes = ['info', 'theisofinfo'];
    expect(isCompleteContain(paths, routes)).toBeTruthy();
  });
});

describe('getRenderType', () => {
  it('object, should render component', () => {
    expect(getRenderType({
      path: 'info',
      routes: ['info'],
      pattern: 'object',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_COMPONENT);
  });

  it('object, should render component', () => {
    expect(getRenderType({
      path: 'info/name',
      routes: ['info'],
      pattern: 'object.string',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_COMPONENT);
  });

  it('object, should render null', () => {
    expect(getRenderType({
      path: 'info',
      routes: ['info'],
      pattern: 'object',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_COMPONENT);
  });

  it('array, should render component 1', () => {
    expect(getRenderType({
      path: 'posts/title',
      routes: ['posts', 'id1'],
      pattern: 'array.string',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_COMPONENT);
  });

  it('array, should render children', () => {
    expect(getRenderType({
      path: 'posts',
      routes: ['posts', 'id1'],
      pattern: 'array',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_CHILDREN);
  });

  it('array, should render children', () => {
    expect(getRenderType({
      path: 'posts',
      routes: ['posts'],
      pattern: 'array',
      routerParams: {
        operator: 'create'
      }
    })).toBe(RENDER_CHILDREN);
  });

  it('array, should render null', () => {
    expect(getRenderType({
      path: 'products/title',
      routes: ['posts', 'id1'],
      pattern: 'array.string',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_NULL);
  });

  it('array, should render component 2', () => {
    expect(getRenderType({
      path: 'posts',
      routes: ['posts'],
      pattern: 'array',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_COMPONENT);
  });

  it('array, should render component 3', () => {
    expect(getRenderType({
      path: 'posts/title',
      routes: ['posts'],
      pattern: 'array.string',
      routerParams: {
        operator: 'update'
      }
    })).toBe(RENDER_COMPONENT);
  });
});