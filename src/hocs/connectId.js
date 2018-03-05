// @flow
import React, {Component} from 'react';

type Props = {
  id: string,
  name: string,
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  [string]: any
};

// $FlowFixMe
export default function connectId(Com) {
  return class ComponentConnectData extends Component<Props> {
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
