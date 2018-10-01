// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';
import type CannerRefId from 'canner-ref-id';

type Props = {
  id: string,
  title: string,
  description: string,
  name: string,
  routes: Array<string>,
  recordValue: Object,
  match: (recordValue: Object, operator: 'create' | 'update') => boolean,
  defaultMode: 'disabled' | 'hidden',
  routerParams: {
    operator: 'create' | 'update',
  },
  refId: CannerRefId,
  hidden: boolean,
  disabled: boolean,
};

export default class Condition extends React.Component<Props> {
  static defaultProps = {
    defaultMode: 'hidden'
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {title, description, recordValue, match, defaultMode, routerParams: {operator}, refId, disabled, hidden} = this.props;
    const matchHidden = defaultMode === 'hidden' ? match(recordValue, operator) : true;
    const matchDisabled = defaultMode === 'disabled' ? !match(recordValue, operator) : false;
    return (
      <Item
        filter={() => !hidden && matchHidden}
        disabled={disabled || matchDisabled}
      />
    );
  }
}
