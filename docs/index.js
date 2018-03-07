import * as React from 'react';
import ReactDOM from 'react-dom';
import CMS from 'provider/components';
import schema from './canner.schema';
import endpoint from './endpoint';
import components from '@canner/cms-plugins-all';
import containers from '@canner/react-cms-containers';

class CMSExample extends React.Component {
  render() {
    return (
      <CMS
        schema={schema}
        endpoint={endpoint}
        components={components}
        containers={containers}
        routes={['info']}
      />
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));

export default CMS;
