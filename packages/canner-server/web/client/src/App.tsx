import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import CMS from './Cms';

const baseUrl = '/cms';

export default class App extends React.Component {
  render() {
    const firstKey = getFirstKey();
    return (
      <Router>
        <Switch>
          <Route path={`${baseUrl}/:activeKey`} component={CMS}/>
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
  if (cloudConfig.sidebarMenu && cloudConfig.sidebarMenu.length) {
    const item = cloudConfig.sidebarMenu.find(menuItem => {
      return schemaKeys.indexOf(menuItem.pathname) >= 0
    })
    if (item)
      return item.pathname;
  }
  return schemaKeys[0];
}
