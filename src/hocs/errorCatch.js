// @flow

import * as React from 'react';
import {Alert} from 'antd';

import type {HOCProps} from './types';

type State = {
  error: any,
  errorInfo: any
};

export default function errorCatch(Com: React.ComponentType<*>) {
  return class ComponentErrorCatch extends React.Component<HOCProps, State> {
    state = {
      error: false,
      errorInfo: {componentStack: null}
    }

    componentDidCatch(e: Error, info: Object) {
      this.setState({
        error: e,
        errorInfo: info
      });
    }

    render() {
      const {error, errorInfo} = this.state;
      if (error) {
        return <Alert
          message="Something went wrong."
          description={(
            <details>
              {error.toString()}
              <br />
              {errorInfo.componentStack}
            </details>
          )}
          type="error"
          closable
        />
      }
      return <Com {...this.props} />
    }
  };
}