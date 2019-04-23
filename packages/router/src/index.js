// @flow

// $FlowFixMe: Unresolved
import createHistory from 'history/createBrowserHistory';
// $FlowFixMe: Unresolved
import historyRouter from '@canner/history-router';

export default class Router extends historyRouter {
  constructor({baseUrl = '/'}: {baseUrl: string}) {
    const history = createHistory();
    super({baseUrl, history})
  }
}