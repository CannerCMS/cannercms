import HistoryRouter from  '../src/index';

const baseUrl = '/tests';

const history = {
    location: {
      pathname: `${baseUrl}/posts/postId1`,
      search: '?op=create&payload={"title":"Default title"}'
    },
    push: () => {}
};

describe('HistoryRouter', () => {
  it('should getRoutes return expected results', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getRoutes()).toEqual(['posts', 'postId1']);
  });
  

  it('should getParams return expected results', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getParams()).toEqual({op: 'create', payload: {title: 'Default title'}});
  });

  it('should getParams return empty object', () => {
    const historyWithEmptySearch = {
      location: {
        pathname: '/posts/postId1',
        search: ''
      },
      push: () => {}
    }
    const router = new HistoryRouter({baseUrl, history: historyWithEmptySearch});
    expect(router.getParams()).toEqual({});
  });

  it('should call history.push', () => {
    history.push = jest.fn()
    const router = new HistoryRouter({baseUrl, history});
    router.goTo({
      pathname: '/path',
      params: {op: 'create', payload: {title: 'Default title'}}
    })
    expect(history.push).toBeCalledWith(`${baseUrl}/path?op=create&payload=%7B%22title%22%3A%22Default%20title%22%7D`);
  });

  it('should call history.push with no query string', () => {
    history.push = jest.fn()
    const router = new HistoryRouter({baseUrl, history});
    router.goTo({
      pathname: '/path'
    })
    expect(history.push).toBeCalledWith(`${baseUrl}/path`);
  });
});