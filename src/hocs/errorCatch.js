import React from 'react';
import {Alert} from 'antd'
// @flow
import RefId from 'canner-ref-id';

type Props = {
  refId: RefId,
  keyName: string,
  routes: Array<string>,
  pattern: string,
  params: Object,
  request: Function,
  items: Object,
  fetch: Function
};

type State = {
  error: any,
  errorInfo: any
};

export default function errorCatch(Com: React.ComponentType<*>) {
  return class ComponentErrorCatch extends React.Component<Props, State> {
    state = {
      error: false,
      errorInfo: null
    }

    componentDidCatch(e, info) {
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