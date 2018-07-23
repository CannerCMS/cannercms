import React, { Component } from "react";
import {Map} from 'immutable';

export default class Fields extends Component {
  static defaultProps = {
    value: new Map()
  };

  onChange = (e, type) => {
    const { refId, value } = this.props;
    const newValue = e.target.value;
    this.props.onChange(refId, "update", value.setIn([type], newValue));
  }

  render() {
    const { value } = this.props;
    return (
      <div style={{border: "1px solid #CCC", padding: "20px"}}>
        <h1>Your name</h1>
        <input
          type="text"
          value={value.get('name')}
          onChange={(e) => this.onChange(e, 'name')}
        />
        <h1>Content</h1>
        <textarea
          value={value.get('content')}
          onChange={(e) => this.onChange(e, 'content')}
        />
      </div>
    );
  }
}
