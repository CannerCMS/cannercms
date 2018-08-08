// @flow

import queryString from 'query-string';

type HistoryType = {
  location: {
    pathname: string,
    search: string
  },
  push: string => void
}

type GoToParamsType = {
  pathname: string,
  operator?: 'create' | 'update',
  payload?: Object,
  where?: Object,
  sort?: Object,
  pagination?: Object
};

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

  getOperator = () => {
    const {location: {search}} = this.history;
    const qs = queryString.parse(search);
    return qs.operator || 'update';
  }

  getPayload = () => {
    return getUrlObjectParams(this.history, 'payload');
  }

  getWhere = () => {
    return getUrlObjectParams(this.history, 'where');
  }

  getSort = () => {
    return getUrlObjectParams(this.history, 'sort');
  }

  getPagination = () => {
    return getUrlObjectParams(this.history, 'pagination');
  }

  goTo = ({pathname, operator, payload, where, sort, pagination}: GoToParamsType) => {
    const pathnameWithoutFirstSlash = deleteFirstSlash(pathname);
    const qs = queryString.stringify({
      operator,
      payload: JSON.stringify(payload),
      where: JSON.stringify(where),
      sort: JSON.stringify(sort),
      pagination: JSON.stringify(pagination),
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

function getUrlObjectParams(history, key) {
  const {location: {search}} = history;
  const qs = queryString.parse(search);
  return qs[key] ? JSON.parse(qs[key]) : {};
}
