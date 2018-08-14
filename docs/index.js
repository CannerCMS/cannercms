import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Canner from 'packages/canner/src';
import Wrapper from 'packages/canner-container/src';
import R from 'packages/history-router/src';
import schema from './canner.schema';
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
            <Wrapper
              schema={schema}
              sidebarConfig={{
                menuConfig: true
              }}
              navbarConfig={{
                renderMenu: () => null
              }}
              router={new R({
                history,
                baseUrl
              })}
            >
              <Canner
                schema={{...schema}}
                afterDeploy={this.afterDeploy}
                dataDidChange={this.dataDidChange}
              />
            </Wrapper>
          );
        }}/>
      </Router>
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));
