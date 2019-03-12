// @flow

import * as React from 'react';
import RefId from 'canner-ref-id';
import type {Query} from '../query';
import { Context } from 'canner-helpers';
import type {Reset, HOCProps} from './types';

type State = {
  canRender: boolean,
  refId: RefId
};

export default function connectContext(Com: React.ComponentType<*>) {
  return class ComponentConnectContext extends React.Component<HOCProps, State> {
    refId: RefId;
    query: Query;
    reset: Reset;

    render() {
      return <Context.Consumer>
        {contextValue => {
          return (
            <Com
              {...contextValue}
              {...this.props}
            />
          );
        }}
      </Context.Consumer>
    }
  };
}
