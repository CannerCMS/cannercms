import React, { PureComponent } from "react";

export default class StringInput extends PureComponent {

  onChange = (e) => {
    this.props.onChange(this.props.refId, "update", e.target.value);
  };

  render() {
    const { disabled, value } = this.props;
    return (
      <input
        disabled={disabled}
        type="text"
        value={value}
        onChange={this.onChange}
      />
    );
  }
}
