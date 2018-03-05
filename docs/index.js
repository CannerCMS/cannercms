import * as React from 'react';
import ReactDOM from 'react-dom';
import {CMS} from '../src';

class CMSExample extends Component {
  render() {
    return (
      <CMS />
    );
  }
}

ReactDOM.render(
  <CMSExample />
, document.getElementById('root'));

export default CMS;
