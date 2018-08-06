import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import Canner from 'packages/canner/src';
import Wrapper from 'packages/canner-wrapper/src';
import {ReactRouterProvider} from 'packages/canner/src';
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
            <ReactRouterProvider
              history={history}
              baseUrl={baseUrl}
            >
              <Wrapper
                schema={schema}
                sidebarConfig={{
                  menuConfig: true
                }}
                navbarConfig={{
                  renderMenu: () => null
                }}
              >
                <Canner
                  schema={{...schema}}
                  afterDeploy={this.afterDeploy}
                  dataDidChange={this.dataDidChange}
                />
              </Wrapper>
            </ReactRouterProvider>
          );
        }}/>
      </Router>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));
