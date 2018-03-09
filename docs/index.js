import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import queryString from 'query-string';
import CMS from '../src/provider/components';
import schema from './canner.schema';
import endpoint from './endpoint';
import components from '@canner/cms-plugins-all';
import containers from '@canner/react-cms-containers';
import {Layout, Menu} from 'antd';

const jsonSchema = schema.schema;
class CMSExample extends React.Component {
  render() {
    const baseUrl = "/docs";
    return (
      <Router>
        <Route path="/docs/**" render={({location, history, match}) => {
          return <Layout>
            <Layout.Sider>
              <Menu>
                {
                  Object.keys(jsonSchema).map(key => (
                    <Menu.Item key={key}>
                      <Link to={`${baseUrl}/${key}`}>
                        {jsonSchema[key].title}
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
                components={components}
                containers={containers}
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

export default CMS;
