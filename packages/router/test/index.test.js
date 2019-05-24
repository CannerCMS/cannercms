import Router from '../src/index';

const baseUrl = '/';

describe('Router', () => {
  it('should Router have getRoutes method', () => {
    const router = new Router({ baseUrl });
    expect(router.getRoutes).toBeDefined();
  });

  it('should Router have getOperator method', () => {
    const router = new Router({ baseUrl });
    expect(router.getOperator).toBeDefined();
  });

  it('should Router have getPayload method', () => {
    const router = new Router({ baseUrl });
    expect(router.getPayload).toBeDefined();
  });

  it('should Router have getSort method', () => {
    const router = new Router({ baseUrl });
    expect(router.getSort).toBeDefined();
  });

  it('should Router have getWhere method', () => {
    const router = new Router({ baseUrl });
    expect(router.getWhere).toBeDefined();
  });

  it('should Router have goTo method', () => {
    const router = new Router({ baseUrl });
    expect(router.goTo).toBeDefined();
  });
});
