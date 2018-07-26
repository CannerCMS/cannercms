import * as React from 'react';
import {Input} from 'antd';
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.callbackId = props.onDeploy(v => {
      return `${v}_appendByOnDeployMethod`;
    });
  }

  componentWillUnmount () {
    this.props.removeOnDeploy(this.callbackId);
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