import React, { Component } from "react";

export default class Fields extends Component {
  static defaultProps = {
    value: {}
  };

  onChange = (e, type) => {
    const { refId, value } = this.props;
    const newValue = e.target.value;
    this.props.onChange(refId, "update", {...value, [type]: newValue});
  }

  render() {
    const { value } = this.props;
    return (
      <div style={{border: "1px solid #CCC", padding: "20px"}}>
        <h1>Your name</h1>
        <input
          type="text"
          value={value.name}
          onChange={(e) => this.onChange(e, 'name')}
        />
        <h1>Content</h1>
        <textarea
          value={value.content}
          onChange={(e) => this.onChange(e, 'content')}
        />
      </div>
    );
  }
}
