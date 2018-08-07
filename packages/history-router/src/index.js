// @flow

import queryString from 'query-string';

type HistoryType = {
  location: {
    pathname: string,
    search: string
  },
  push: string => void
}

export default class HistoryRouter {
  constructor({baseUrl = '/', history}: {baseUrl: string, history: HistoryType}) {
    this.baseUrl = baseUrl;
    this.history = history;
  }

  getRoutes = () => {
    const {location: {pathname}} = this.history;
    const pathnameWithoutBaseUrl = pathname.substring(this.baseUrl.length);
    return deleteFirstSlash(pathnameWithoutBaseUrl).split('/');
  }

  getParams = () => {
    const {location: {search}} = this.history;
    const qs = queryString.parse(search);
    if (qs && qs.payload) {
      return {
        ...qs,
        payload: JSON.parse(qs.payload)
      }
    }
    return qs;
  }

  goTo = ({pathname, params = {}}: { pathname: string, params: Object}) => {
    const pathnameWithoutFirstSlash = deleteFirstSlash(pathname);
    const { payload, ...reset } = params;
    const qs = queryString.stringify({
      ...reset,
      payload: JSON.stringify(payload),
    });
    this.history.push(`${this.baseUrl}/${pathnameWithoutFirstSlash}${qs ? `?${qs}` : ''}`);
  }
}

function deleteFirstSlash(path) {
  if (path && path[0] === '/') {
    return path.substring(1);
  }
  return path;
}
