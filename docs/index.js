import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import queryString from 'query-string';
import CMS from '../src/components';
import schema from './canner.schema';
import endpoint from './endpoint';
import imageServiceConfigs from './imageServiceConfigs';
import layouts from '@canner/react-cms-containers';
import {Layout, Menu} from 'antd';
const {cannerSchema} = schema;

class CMSExample extends React.Component {
  render() {
    const baseUrl = "/docs";
    // eslint-disable-next-line
    console.log(schema);
    return (
      <Router>
        <Route path="/docs/**" render={({location, history, match}) => {
          return <Layout>
            <Layout.Sider>
              <Menu>
                {
                  Object.keys(cannerSchema).map(key => (
                    <Menu.Item key={key}>
                      <Link to={`${baseUrl}/${key}`}>
                        {cannerSchema[key].title}
                      </Link>
                    </Menu.Item>
                  ))
                }
              </Menu>
            </Layout.Sider>
            <Layout.Content>
              <CMS
                schema={schema}
                endpoint={endpoint}
                imageServiceConfigs={imageServiceConfigs}
                layouts={layouts}
                routes={match.params[0].split('/')}
                params={queryString.parse(location.search)}
                baseUrl={baseUrl}
                goTo={history.push}
              />
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
