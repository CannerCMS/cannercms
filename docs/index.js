import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Canner from 'packages/canner/src';
import Container, {transformSchemaToMenuConfig} from 'packages/canner-container/src';
import R from 'packages/history-router/src';
import schema from './canner.schema';
import Graphql from './components/graphql';
import styled from 'styled-components';
// eslint-disable-next-line
export const Logo = styled.img`
  background-color: #283050;
  padding: 20px;
  margin-left: -20px;
  width: 200px;
`
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
                  menuConfig: [
                    {
                      pathname: '__back',
                      title: 'Back to Dashboard',
                      onClick: () => {
                        // eslint-disable-next-line
                        console.log('back to dashboard');
                      },
                      icon: 'left'
                    },
                    ...transformSchemaToMenuConfig(schema.schema)
                  ]
                }}
                navbarConfig={{
                  logo: <Logo src="https://cdn.canner.io/cms-page/d89f77c19e5d3aa366ba1498dddd64ef.svg" />,
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
                  ref={cms => this.cms = cms}
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
