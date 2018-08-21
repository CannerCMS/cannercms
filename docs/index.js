import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Canner from 'packages/canner/src';
import Container from 'packages/canner-container/src';
import R from 'packages/history-router/src';
import schema from './canner.schema';
import Graphql from './components/graphql';
// eslint-disable-next-line
console.log(schema);

class CMSExample extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const baseUrl = "/docs";
    // eslint-disable-next-line
    return (
      <Router>
        <div>
          <Route path="/docs" render={({history}) => {
            return (
              <Container
                schema={schema}
                sidebarConfig={{
                  menuConfig: true
                }}
                navbarConfig={{
                  showSaveButton: true,
                  renderMenu: () => null
                }}
                router={new R({
                  history,
                  baseUrl
                })}
              >
                <Canner
                  schema={{...schema}}
                />
              </Container>
            );
          }}/>
          <Route path="/graphql" component={Graphql}/>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));
