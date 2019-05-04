// @flow

import * as React from 'react';
import {Alert} from 'antd';
import { FormattedMessage } from 'react-intl';

type State = {
  error: any,
  errorInfo: any
};

export default function errorCatch(Com: React.ComponentType<*>) {
  // TODO: fix props type
  return class ComponentErrorCatch extends React.Component<any, State> {
    state = {
      error: false,
      errorInfo: {componentStack: null}
    }

    shouldComponentUpdate(nextProps: any, nextState: State) {
      if (nextState.error !== this.state.error) {
        return true;
      }

      if (nextProps.refId.toString() !== this.props.refId.toString()) {
        return true;
      }

      return false;
    }

    componentDidCatch(e: Error, info: Object) {
      // eslint-disable-next-line
      console.log(e, info);
      this.setState({
        error: e,
        errorInfo: info
      });
    }

    render() {
      const {error} = this.state;
      if (error) {
        return <Alert
          message={<FormattedMessage id="hocs.errorCatch.message" />}
          type="error"
          closable
          closeText={
            <FormattedMessage id="hocs.errorCatch.refresh" />
          }
          afterClose={() => location.reload()}
        />
      }
      return <Com {...this.props} />
    }
  };
}