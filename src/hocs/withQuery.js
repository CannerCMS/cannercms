// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
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
}

// $FlowFixMe
export default function withQuery(Com) {
  // this hoc will fetch data;
  return class ComponentWithQuery extends PureComponent<Props, State> {
    componentId: string;
    subscription: any;
    static contextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
    };

    constructor(props: Props) {
      super(props);
      // now use is to be a subjectId
      this.state = {
        value: null,
        rootValue: null,
        isFetching: true,
      };
    }

    componentDidMount() {
      const {fetch} = this.context;
      const {id} = this.props;
      const key = id.split('/')[0];
      // second key: use key as a subjectID
      fetch(key, key).then((ctx) => {
        this.setState({
          value: ctx.response.body,
          isFetching: false,
        });
        // this.subscribe(this.props.id);
      });
    }

    // componentWillUnmount() {
    //   this.unsubscribe();
    // }

    // unsubscribe = () => {
    //   if (this.subscription) {
    //     this.subscription.unsubscribe();
    //   }
    // }

    // subscribe = (id: string): Promise<any> => {
    //   const {subscribe} = this.context;
    //   const key = id.split('/')[0];
    //   return subscribe(key, key, 'value', value => {
    //     this.setState({
    //       rootValue: value,
    //       value: getValue(value, id)
    //     });
    //   }).then(subscription => {
    //     this.subscription = subscription;
    //   });
    // }

    render() {
      const {value, isFetching} = this.state;
      if (isFetching) {
        return <Spin indicator={antIcon} />;
      }
      return <Com {...this.props} value={value} />;
    }
  };
}
