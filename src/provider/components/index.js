// @flow

import * as React from 'react';
import Provider from './Provider';
import Generator from './Generator';
import type {Node} from './Generator';
import type {Endpoint} from '../endpoint';

type Props = {
  schema: {[key: string]: any},
  endpoint: {[key: string]: Endpoint},
  dataDidChange: void => void,
  children: React.ChildrenArray<React.Node>,
  loading: React.ComponentType<*>,

  componentTree: {[string]: Node},
  plugins: {[string]: React.ComponentType<*>},
  hocs: {[string]: React.ComponentType<*>},
  containers: {[string]: React.ComponentType<*>},
  goTo: (path: string) => void,
  baseUrl: string,
  routes: Array<string>,
  params: {[string]: string},
  activeKey: string,
}

class CannerCMS extends React.Component<Props> {
  static defaultProps = {
    schema: {},
    endpoint: {},
    dataDidChange: () => {},
    componentTree: {},
    plugins: {},
    hocs: {},
    containers: {},
    goTo: () => {},
    baseUrl: '',
    routes: [],
    params: {},
    activeKey: '',
  }

  render() {
    const {
      schema,
      endpoint,
      dataDidChange,
      loading,
      componentTree,
      plugins,
      hocs,
      containers,
      goTo,
      baseUrl,
      routes,
      params,
      activeKey,
    } = this.props;
    return (
      <Provider
        schema={schema}
        endpoint={endpoint}
        dataDidChange={dataDidChange}
        loading={loading}
      >
        <Generator
          componentTree={componentTree}
          plugins={plugins}
          hocs={hocs}
          containers={containers}
          goTo={goTo}
          baseUrl={baseUrl}
          routes={routes}
          params={params}
          activeKey={activeKey}
        />
      </Provider>
    );
  }
}

export default CannerCMS;
