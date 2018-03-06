import * as React from 'react';
import ReactDOM from 'react-dom';
import {CMS} from '../src';

class CMSExample extends React.Component {
  render() {
    return (
      <CMS
        // schema,
        // endpoint,
        // dataDidChange,
        // loading,
        // componentTree,
        // plugins,
        // hocs,
        // containers,
        // goTo,
        // baseUrl,
        // routes,
        // params,
        // activeKey,
      />
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));

export default CMS;
