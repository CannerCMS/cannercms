// @flow

import * as React from 'react';

type Props = {
  id: string,
  name: string,
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  [string]: any
};

export default function connectId(Com: React.ComponentType<*>) {
  return class ComponentConnectId extends React.Component<Props> {
    id: string
    constructor(props: Props) {
      super(props);
      const {id, name} = props;
      this.id = `${id ? id + '/' : ''}${name}`;
    }

    render() {
      return <Com {...this.props} id={this.id}/>;
    }
  };
}