/**
 * @flow
 */

import * as React from 'react';
import {App} from '../app';
import {Bucket, Cache, EndpointMiddleware, Store} from '../app/middleware';
import type Endpoint from '../app/endpoint';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import {HOCContext} from '../hocs/context';

type Props = {
  schema: {[key: string]: any},
  endpoints: {[key: string]: Endpoint},
  dataDidChange: void => void,
  children: React.ChildrenArray<React.Node>
}

type State = {

}

export default class Provider extends React.PureComponent<Props, State> {
  app: App

  constructor(props: Props) {
    super(props);
    (this: any).request = this.request.bind(this);
    (this: any).subscribe = this.subscribe.bind(this);
    (this: any).fetch = this.fetch.bind(this);
    const {schema, endpoints} = props;
    this.app = new App()
      .use(new Store())
      .use(new Bucket())
      .use(new Cache())
      .use(new EndpointMiddleware({schema, endpoint: endpoints}));
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
        .use(new EndpointMiddleware({schema: nextProps.schema, endpoint: nextProps.endpoints}));
    }
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
    return <HOCContext.Provider value={{
      subscribe: this.subscribe,
      request: this.request,
      fetch: this.fetch,
      deploy: this.deploy,
    }}>
      {React.Children.only(this.props.children)}
    </HOCContext.Provider>;
  }
}
