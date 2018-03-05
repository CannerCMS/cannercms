// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import isNull from 'lodash/isNull';
import {Spin, Icon} from 'antd';
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;
type Props = {
  id: string,
  isEntity: boolean,
  name: string,
  title: string, // only used in withTitleAndDesription hoc
  description: string, // only used in withTitleAndDesription hoc
  layout?: 'horizontal' | 'vertical', // only used in withTitleAndDesription hoc
  [string]: any
};

type State = {
  value: any,
  rootValue: any,
  isFetching: boolean
};

// $FlowFixMe
export default function connectData(Com) {
  return class ComponentConnectData extends PureComponent<Props, State> {
    static contextTypes = {
      subscribe: PropTypes.func,
    };
    subscription: any;
    constructor(props: Props) {
      super(props);
      const value = getValue(props.value, props.id);
      this.state = {
        value,
        rootValue: props.value,
        isFetching: isNull(value),
      };
    }

    componentDidMount() {
      this.subscribe(this.props.id);
    }

    subscribe = (id: string) => {
      const {subscribe} = this.context;
      const key = id.split('/')[0];
      subscribe(key, key, 'value', (value) => {
        this.setState({
          rootValue: value,
          value: getValue(value, id),
          isFetching: false,
        });
      }).then((subscription) => {
        this.subscription = subscription;
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    unsubscribe = () => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    render() {
      const {rootValue, value, isFetching} = this.state;
      if (isFetching) {
        return <Spin indicator={antIcon} />;
      }
      return <Com {...this.props} rootValue={rootValue} value={value}/>;
    }
  };
}

function getValue(value, id) {
  if (value && id) {
    return value.getIn(id.split('/').slice(1));
  }
  return null;
}
