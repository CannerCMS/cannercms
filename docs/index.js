import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import CMS from 'packages/CMS/src/components';
import RouteProvider from 'packages/CMS/src/components/routeProvider/ReactRouterProvider';
import schema from './canner.schema';
import {Layout, Menu} from 'antd';
// eslint-disable-next-line
console.log(schema);

class CMSExample extends React.Component {
  constructor(props) {
    super(props);
  }

  dataDidChange = (dataChanged) => {
    // eslint-disable-next-line
    console.log(dataChanged);
  }

  afterDeploy = () => {
    // eslint-disable-next-line
    console.log('deployed');
  }

  render() {
    const baseUrl = "/docs";
    // eslint-disable-next-line
    return (
      <Router>
        <Route path="/docs" render={({history}) => {
          return (
            <RouteProvider
              history={history}
              baseUrl={baseUrl}
            >
              <CMS
                schema={{...schema}}
                afterDeploy={this.afterDeploy}
                dataDidChange={this.dataDidChange}
              />
            </RouteProvider>
          );
        }}/>
      </Router>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));
