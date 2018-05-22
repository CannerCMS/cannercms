import * as React from 'react';
import {Input} from 'antd';
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    props.onDeploy(v => {
      return `${v}_appendByOnDeployMethod`;
    });
  }

  onChange = e => {
    const {onChange, refId} = this.props;

    onChange(refId, 'update', e.target.value)
  }
  render() {
    const {value} = this.props;
    return (
      <Input
        value={value}
        onChange={this.onChange}
      />
    );
  }
}