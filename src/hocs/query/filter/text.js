import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'antd';
import isEmpty from 'lodash/isEmpty';
import template from 'lodash/template';
import escapeRegExp from 'lodash/escapeRegExp';
import {injectIntl} from 'react-intl';
import {FilterPlugin, Label} from './share';

@injectIntl
export default class TextFilter extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    regexTemplate: PropTypes.string,
    intl: PropTypes.object,
  };

  static defaultProps = {
    regexTemplate: '<%= value %>',
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    const {onChange, name, regexTemplate} = this.props;
    if (isEmpty(value)) {
      return onChange(name, undefined);
    }
    const compiled = template(regexTemplate);
    onChange(name, {
      $regex: compiled({value: escapeRegExp(value)}),
    });
  }

  render() {
    const {label, intl} = this.props;
    const placeholder = intl.formatMessage({id: 'query.filter.text.placeholder'});
    return (
      <FilterPlugin>
        <Label>{label}</Label>
        <Input
          style={{width: '100%'}}
          placeholder={placeholder}
          onChange={(e) => this.onChange(e.target.value)}
        />
      </FilterPlugin>
    );
  }
}
