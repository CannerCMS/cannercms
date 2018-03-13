/**
 * @flow
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import App from '../app';
import {Bucket, Cache, EndpointMiddleware, Store} from '../middleware';
import type Endpoint from '../endpoint';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';

type Props = {
  schema: {[key: string]: any},
  endpoint: {[key: string]: Endpoint},
  dataDidChange: void => void,
  children: React.ChildrenArray<React.Node>
}

type State = {

}

export default class Provider extends React.PureComponent<Props, State> {
  app: App

  static childContextTypes = {
    subscribe: PropTypes.func,
    request: PropTypes.func,
    fetch: PropTypes.func,
    deploy: PropTypes.func,
  };

  constructor(props: Props) {
    super(props);
    (this: any).request = this.request.bind(this);
    (this: any).subscribe = this.subscribe.bind(this);
    (this: any).fetch = this.fetch.bind(this);
    const {schema, endpoint} = props;
    this.app = new App()
      .use(new Store())
      .use(new Bucket())
      .use(new Cache())
      .use(new EndpointMiddleware({schema, endpoint}));
  }

  componentWillReceiveProps(nextProps: Props) {
    const {schema} = this.props;
    const schemaKey = Object.keys(schema);
    const nextSchemaKey = Object.keys(nextProps.schema);
    if (!isEqual(schemaKey, nextSchemaKey)) {
      this.app = new App()
        .use(new Store())
        .use(new Bucket())
        .use(new Cache())
        .use(new EndpointMiddleware({schema: nextProps.schema, endpoint: nextProps.endpoint}));
    }
  }

  getChildContext() {
    return {
      subscribe: this.subscribe,
      request: this.request,
      fetch: this.fetch,
      deploy: this.deploy,
      // createAction
    };
  }

  fetch(key: string, componentId: string, query: queryType, mutate: Mutate): Promise<*> {
    return this.app.handleChange({
      request: {
        type: 'fetch',
        key,
        query,
        componentId,
      },
      response: {
        mutate,
      },
    });
  }

  subscribe(key: string, componentId: string, subjectType: SubjectType, observer: rxjs$Observer<*>) {
    return this.app.handleChange({
      request: {
        type: 'subscribe',
        key,
        observer,
        componentId,
        subjectType,
      },
    }).then((ctx) => ctx.response.subscription);
  }

  request(action: MutateAction) {
    // const {cannerJSON} = this.state;
    const {dataDidChange} = this.props;
    if (action.type !== 'NOOP') {
      const {key} = action.payload;
      return this.app.handleChange({
        request: {
          type: 'write',
          action,
          key,
        },
      }).then(dataDidChange);
    }
  }

  deploy = (key: string, id: string) => {
    return this.app.handleChange({
      request: {
        type: 'deploy',
        key,
        id,
      },
    });
  }

  _splitKey(path: string | [string, string]) {
    return isArray(path) ?
      path[0].split('/')[0] :
      // $FlowFixMe
      path.split('/')[0];
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
