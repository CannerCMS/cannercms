import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import CMS from '../src/components';
import schema from './canner.schema';
import Tabs from './layouts/tabs';
import {Layout, Menu} from 'antd';
import firebase from 'firebase';
import {FirebaseRtdbClientConnector} from 'canner-graphql-interface';

class CMSExample extends React.Component {
  constructor(props) {
    super(props);
    try {
      firebase.app();
    } catch (e) {
      firebase.initializeApp({
        apiKey: "AIzaSyDXsFofZTaEk6SIhDj0Ot4YuPidKAfY750",
        authDomain: "test-new-qa.firebaseapp.com",
        databaseURL: "https://test-new-qa.firebaseio.com",
        projectId: "test-new-qa",
        storageBucket: "test-new-qa.appspot.com",
        messagingSenderId: "983887338585"
      });
    }
    const defaultApp = firebase.app()
    this.connector = new FirebaseRtdbClientConnector({
      database: defaultApp.database()
    });
    this.state = {
      login: false
    };
  }

  auth = () => new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user);
      }
    });
    firebase.auth().signInAnonymously().catch(error => {
      reject(error);
    });
  });

  componentDidMount() {
    this.auth().then(() => {
      this.setState({
        login: true
      });
    });
  }

  render() {
    const baseUrl = "/docs";
    const {cannerSchema} = schema;
    const {login} = this.state;
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
              {
                login ?
                  <CMS
                    schema={schema}
                    baseUrl={baseUrl}
                    history={history}
                    connector={{
                      __default: this.connector
                    }}
                    layouts={{
                      Tabs
                    }}
                  /> :
                  null
              }
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
