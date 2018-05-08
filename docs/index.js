import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import CMS from '../src/components';
import schema from './canner.schema';
import Tabs from './layouts/tabs';
import {Layout, Menu} from 'antd';
const {cannerSchema} = schema;
class CMSExample extends React.Component {
  render() {
    const baseUrl = "/docs";
    // eslint-disable-next-line
    console.log(schema);
    return (
      <Router>
        <Route path="/docs/**" render={({history}) => {
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
                baseUrl={baseUrl}
                history={history}
                layouts={{
                  Tabs
                }}
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
