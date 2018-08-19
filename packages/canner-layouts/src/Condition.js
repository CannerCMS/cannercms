// @flow

import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  id: string,
  title: string,
  description: string,
  name: string,
  routes: Array<string>
};

export default class Condition extends React.Component<Props> {
  static defaultProps = {
    defaultMode: 'hidden'
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {title, description, recordValue, match, defaultMode, routerParams: {operator}, refId} = this.props;
    return (
      <Item
        filter={() => defaultMode === 'hidden' ? match(recordValue, operator) : true}
        disabled={defaultMode === 'disabled' ? !match(recordValue, operator) : false}
      />
    );
  }
}
