import HistoryRouter from  '../src/index';

const baseUrl = '/tests';

const history = {
    location: {
      pathname: `${baseUrl}/posts/postId1`,
      search: `?operator=create&payload={"title":"Default title"}&where={"a": ">1"}&sort={"a": "ASC"}&pagination={"first": 10}`
    },
    push: () => {}
};

const historyWithEmptySearch = {
  location: {
    pathname: '/posts/postId1',
    search: ''
  },
  push: () => {}
}

describe('HistoryRouter', () => {
  it('should getRoutes return expected results', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getRoutes()).toEqual(['posts', 'postId1']);
  });

  it('should getOperator return expected result', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getOperator()).toEqual('create');
  });

  it('should getOperator return expected default result', () => {
    const router = new HistoryRouter({baseUrl, history: historyWithEmptySearch});
    expect(router.getOperator()).toEqual('update');
  });

  it('should getPayload return expected results', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getPayload()).toEqual({title: 'Default title'});
  });

  it('should getPayload return empty object', () => {
    const router = new HistoryRouter({baseUrl, history: historyWithEmptySearch});
    expect(router.getPayload()).toEqual({});
  });

  it('should getWhere return expected results', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getWhere()).toEqual({a: '>1'});
  });

  it('should getWhere return empty object', () => {
    const router = new HistoryRouter({baseUrl, history: historyWithEmptySearch});
    expect(router.getWhere()).toEqual({});
  });

  it('should getSort return expected results', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getSort()).toEqual({a: 'ASC'});
  });

  it('should getSort return empty object', () => {
    const router = new HistoryRouter({baseUrl, history: historyWithEmptySearch});
    expect(router.getSort()).toEqual({});
  });

  it('should getPagination return expected results', () => {
    const router = new HistoryRouter({baseUrl, history});
    expect(router.getPagination()).toEqual({first: 10});
  });

  it('should getPagination return empty object', () => {
    const router = new HistoryRouter({baseUrl, history: historyWithEmptySearch});
    expect(router.getPagination()).toEqual({});
  });

  it('should call history.push', () => {
    history.push = jest.fn()
    const router = new HistoryRouter({baseUrl, history});
    router.goTo({
      pathname: '/path',
      operator: 'create',
      payload: {title: 'Default title'},
      sort: {items: "ASC"}
    });
    expect(history.push).toBeCalledWith(`${baseUrl}/path?operator=create&payload=%7B%22title%22%3A%22Default%20title%22%7D&sort=%7B%22items%22%3A%22ASC%22%7D`);
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