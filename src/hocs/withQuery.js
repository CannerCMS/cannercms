// @flow

import * as React from 'react';
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

type Context = {
  fetch: (key: string, componentId: string, query: any) => Promise<any>,
  subscribe: (key: string, componentId: string, type: string, callback: Function) => Promise<any>,
  query: {
    filter?: any,
    sort?: any,
    pagination?: any
  },
  componentId: string
}

export default function withQuery(Com: React.ComponentType<*>) {
  // this hoc will fetch data;
  return class ComponentWithQuery extends React.PureComponent<Props, State> {
    componentId: string;
    key: string;
    subscription: any;
    static contextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      query: PropTypes.shape({
        filter: PropTypes.any,
        sort: PropTypes.any,
        pagination: PropTypes.any
      }),
      componentId: PropTypes.string
    };

    static childContextTypes = {
      componentId: PropTypes.string
    }

    getChildContext() {
      return {
        componentId: this.context.componentId || this.props.id
      };
    }

    constructor(props: Props, context: Context) {
      super(props);
      // now use is to be a subjectId
      this.state = {
        value: null,
        rootValue: null,
        isFetching: true
      };
      this.componentId = context.componentId || props.id;
      this.key = props.id.split('/')[0];
    }

    componentDidMount() {
      this.queryData();
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    queryData = () => {
      const {fetch, query} = this.context;
      // second key: use key as a subjectID
      fetch(this.key, this.componentId, query).then(ctx => {
        this.setState({
          rootValue: ctx.response.body,
          value: getValue(ctx.response.body, this.props.id),
          isFetching: false
        });
        this.subscribe();
      });
    }

    unsubscribe = () => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    subscribe = (): Promise<any> => {
      const {subscribe} = this.context;
      return subscribe(this.key, this.componentId, 'value', value => {
        this.setState({
          rootValue: value,
          value: getValue(value, this.props.id)
        });
      }).then(subscription => {
        this.subscription = subscription;
      });
    }

    render() {
      const {value, isFetching, rootValue} = this.state;
      if (isFetching) {
        return <Spin indicator={antIcon} />;
      }
      return <Com {...this.props} rootValue={rootValue} value={value} />;
    }
  };
}

function getValue(value, id) {
  if (value && id) {
    return value.getIn(id.split('/').slice(1));
  }
  return null;
}