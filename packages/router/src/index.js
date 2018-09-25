// @flow

import createHistory from 'history/createBrowserHistory';
import historyRouter from '@canner/history-router';

export default class Router extends historyRouter {
  constructor({baseUrl = '/'}: {baseUrl: string}) {
    const history = createHistory();
    super({baseUrl, history})
  }
}