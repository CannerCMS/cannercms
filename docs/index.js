import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import CMS from '../src/components';
import schema from './canner.schema';
import {Layout, Menu} from 'antd';
import firebase from 'firebase';
import {FirebaseRtdbClientConnector} from 'canner-graphql-interface';
console.log(schema);

class CMSExample extends React.Component {
  constructor(props) {
    super(props);
    // try {
    //   firebase.app();
    // } catch (e) {
    //   firebase.initializeApp({
    //     apiKey: "AIzaSyDXsFofZTaEk6SIhDj0Ot4YuPidKAfY750",
    //     authDomain: "test-new-qa.firebaseapp.com",
    //     databaseURL: "https://test-new-qa.firebaseio.com",
    //     projectId: "test-new-qa",
    //     storageBucket: "test-new-qa.appspot.com",
    //     messagingSenderId: "983887338585"
    //   });
    // }
    // const defaultApp = firebase.app()
    // this.connector = new FirebaseRtdbClientConnector({
    //   database: defaultApp.database()
    // });
    this.state = {
      login: true,
      dataChanged: {}
    };
  }

  // auth = () => new Promise((resolve, reject) => {
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       resolve(user);
  //     }
  //   });
  //   firebase.auth().signInAnonymously().catch(error => {
  //     reject(error);
  //   });
  // });

  // componentDidMount() {
  //   this.auth().then(() => {
  //     this.setState({
  //       login: true
  //     });
  //   });
  // }

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
    const {login} = this.state;
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
                      <Link to={`${baseUrl}?route=${key}`}>
                        {schema.schema[key].title}
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
                    query={history.location.search}
                    push={history.push}
                    afterDeploy={this.afterDeploy}
                    dataDidChange={this.dataDidChange}
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
