
import React from 'react';
import ReactDOM from 'react-dom';
// prevent path of windows
import schema from '/Users/siou/projects/canner/packages/canner-server/web/client/schema/canner.schema';
import App from '/Users/siou/projects/canner/packages/canner-server/web/client/src/app';
import "antd/dist/antd.less";
window.schema = schema;
ReactDOM.render(<App />, document.getElementById('root'));
