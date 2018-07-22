// @flow

import React from 'react';
import queryString from 'query-string';
import type {ReactRouterProviderProps} from '../types';

export default class ReactRouterProvider extends React.Component<ReactRouterProviderProps> {
  goTo = (path: string, search?: Object | string) => {
    const {baseUrl, history: {push}} = this.props;
    const qs = typeof search === 'string' ? search : queryString.stringify(search);
    push(`${baseUrl}/${path}${qs ? `?${qs}` : ''}`);
  }

  render() {
    const {children, history: {location}, baseUrl} = this.props;
    const {pathname, search} = location;
    const routes = getRoutes(pathname, baseUrl);
    const params = queryString.parse(search);
    return (
      <React.Fragment>
        {React.cloneElement(children, {
          goTo: this.goTo,
          params: params,
          routes: routes
        })}
      </React.Fragment>
    )
  }
}

function getRoutes(pathname, baseUrl = '/') {
  let pathnameWithoutBaseUrl = pathname.substring(baseUrl.length);
  if (pathnameWithoutBaseUrl[0] === '/') {
    pathnameWithoutBaseUrl = pathnameWithoutBaseUrl.substring(1);
  }
  return pathnameWithoutBaseUrl.split('/');
}
