// @flow

import * as React from 'react';
import {Spin, Icon} from 'antd';
import type RefId from 'canner-ref-id';
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />;

type Props = {
  refId: RefId,
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
      this.key = props.refId.getPathArr()[0];
    }

    componentDidMount() {
      this.queryData();
    }

    componentWillReceiveProps(props: Props) {
      const {componentId, refId} = this.props;
      if (componentId !== props.componentId || refId.toString() !== props.refId.toString()) {
        this.queryData();
      } 
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    getRootValue = () => {
      return this.state.rootValue;
    }

    queryData = () => {
      const {fetch, query, componentId, refId} = this.props;
      // second key: use key as a subjectID
      return fetch(this.key, componentId, query).then(ctx => {
        this.setState({
          rootValue: ctx.response.body,
          value: getValue(ctx.response.body, refId.getPathArr()),
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
      const {subscribe, componentId, refId} = this.props;
      return subscribe(this.key, componentId, 'value', value => {
        this.setState({
          rootValue: value,
          value: getValue(value, refId.getPathArr())
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

function getValue(value, idPathArr) {
  if (value && idPathArr) {
    return value.getIn(idPathArr.slice(1));
  }
  return null;
}