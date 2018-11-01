import * as React from "react";
import { Select } from "antd";
const { Option } = Select;

export default class TableSelectColumn extends React.Component {
  handleSelect = value => {
    const { cannerProps, dataKeyRefId } = this.props;
    const { onChange, deploy } = cannerProps;

    onChange(dataKeyRefId, "update", value).then(() => {
      deploy(cannerProps.refId.toString());
    });
  };

  render() {
    const { value, options } = this.props;
    const findOpt = options.find(opt => opt.value === value);

    return (
      <Select
        value={value}
        style={{ color: findOpt ? findOpt.color : 'red' }}
        onSelect={this.handleSelect}
      >
        {options.map(opt => {
          return (
            <Option value={opt.value} key={opt.value}>
              {opt.title}
            </Option>
          );
        })}
      </Select>
    );
  }
}