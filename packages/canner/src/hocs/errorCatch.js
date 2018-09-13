// @flow

import * as React from 'react';
import {Alert} from 'antd';
import { FormattedMessage } from 'react-intl';

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