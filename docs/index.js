import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import CMS from '../src/components';
import RouteProvider from '../src/components/routeProvider/ReactRouterProvider';
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
          return <Layout>
            <Layout.Sider>
              <Menu>
                {
                  Object.keys(schema.schema).map(key => (
                    <Menu.Item key={key}>
                      <Link to={`${baseUrl}/${key}`}>
                        {schema.schema[key].title}
                      </Link>
                    </Menu.Item>
                  ))
                }
              </Menu>
            </Layout.Sider>
            <Layout.Content>
              <RouteProvider
                history={history}
                baseUrl={baseUrl}
              >
                <CMS
                  schema={schema}
                  afterDeploy={this.afterDeploy}
                  dataDidChange={this.dataDidChange}
                />
              </RouteProvider>
            </Layout.Content>
          </Layout>;
        }}/>
      </Router>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));
