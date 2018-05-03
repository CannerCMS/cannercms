import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import CMS from '../src/components';
import schema from './canner.schema';
import schema2 from './canner2.schema';
import {Layout, Menu} from 'antd';
const {cannerSchema} = schema;

class CMSExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeSchema: false
    };
  }

  changeSchema = () => {
    this.setState({
      changeSchema: !this.state.changeSchema
    });
  }

  render() {
    const {changeSchema} = this.state;
    const baseUrl = "/docs";
    // eslint-disable-next-line
    const currSchema = changeSchema ? schema2 : schema;
    const {cannerSchema} = currSchema;
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
                <Menu.Item key="change">
                  <button onClick={this.changeSchema}>changeSchema</button>
                </Menu.Item>
              </Menu>
            </Layout.Sider>
            <Layout.Content>
              <CMS
                cache={false}
                schema={currSchema}
                baseUrl={baseUrl}
                history={history}
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
