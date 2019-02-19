import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import CMS from './Cms';

interface Props {
  intl: {
    messages?: Record<string, string>,
    locale?: string
  },
  baseUrl: string
}

export default class App extends React.Component<Props> {
  render() {
    const {intl, baseUrl} = this.props;
    const firstKey = getFirstKey();
    return (
      <Router>
        <Switch>
          <Route
            path={`${baseUrl}/:activeKey`}
            render={props => <CMS {...props} intl={intl} />}
          />
          <Redirect to={removeDoubleSlash(`${baseUrl}/${firstKey}`)} />
        </Switch>
      </Router>
    );
  }
}

function removeDoubleSlash(url) {
  return url.replace('//', '/');
}

function getFirstKey() {
  const schemaKeys = Object.keys(schema.pageSchema).concat(Object.keys(schema.schema));
  if (cmsConfig.sidebarMenu && cmsConfig.sidebarMenu.length) {
    const item = cmsConfig.sidebarMenu.find(menuItem => {
      return schemaKeys.indexOf(menuItem.pathname) >= 0
    })
    if (item)
      return item.pathname;
  }
  return schemaKeys[0];
}
