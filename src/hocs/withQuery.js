// @flow

import * as React from 'react';
import {Spin, Icon} from 'antd';
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;

type Props = {
  id: string,
  componentId: string,
  query?: QueryDef,
  fetch: FetchDef,
  subscribe: SubscribeDef,
};

type State = {
  value: any,
  rootValue: any,
  isFetching: boolean,
}

export default function withQuery(Com: React.ComponentType<*>) {
  // this hoc will fetch data;
  return class ComponentWithQuery extends React.PureComponent<Props, State> {
    key: string;
    subscription: any;

    constructor(props: Props) {
      super(props);
      // now use is to be a subjectId
      this.state = {
        value: null,
        rootValue: null,
        isFetching: true
      };
      this.key = props.id.split('/')[0];
    }

    componentDidMount() {
      this.queryData();
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    queryData = () => {
      const {fetch, query, componentId, id} = this.props;
      // second key: use key as a subjectID
      return fetch(this.key, componentId, query).then(ctx => {
        this.setState({
          rootValue: ctx.response.body,
          value: getValue(ctx.response.body, id),
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
      const {subscribe, componentId, id} = this.props;
      return subscribe(this.key, componentId, 'value', value => {
        this.setState({
          rootValue: value,
          value: getValue(value, id)
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