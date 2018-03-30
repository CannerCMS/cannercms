// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import type {List} from 'immutable';
import type RefId from 'canner-ref-id';

type Props = {
  type: string,
  routes: Array<string>,
  rootValue: List<any>,
  name: string,
  refId: RefId,
  params: any,
  renderChildren: ({[string]: any}) => React.Node,
  fetch: FetchDef,
  query: QueryDef,
  componentId: string,

  subscribe: SubscribeDef,
  request: RequestDef,
  deploy: DeployDef,
  reset: ResetDef
};

type State = {
  restRoutes: Array<string>,
  index: number | string,
  renderType: 0 | 1 | 2,
  query: any,
  canRender: boolean,
}

// $FlowFixMe
export default function withRoute(Com: React$Component<*>) {
  return class ComponentWithRoute extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        renderType: 0,
        restRoutes: props.routes,
        index: 0,
        query: {},
        canRender: false
      };
    }

    static childContextTypes = {
      componentId: PropTypes.string,
      query: PropTypes.shape({
        filter: PropTypes.object,
        sort: PropTypes.object,
        order: PropTypes.object,
      }),

      fetch: PropTypes.func,
      subscribe: PropTypes.func,
      request: PropTypes.func,
      deploy: PropTypes.func,
      reset: PropTypes.func,
    }

    getChildContext() {
      const {componentId, query, fetch, subscribe, request, deploy, reset} = this.props;
      return {
        componentId, query, fetch, subscribe, request, deploy, reset
      };
    }

    save = () => {
      this.context.deploy();
    }

    componentWillMount() {
      this.updateState(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
      // eslint-disable-next-line
      if (nextProps.routes != this.props.routes) {
        this.updateState(nextProps);
      }
    }

    updateState = (props: Props): Promise<*> => {
      const {type, rootValue, name, refId, params, routes, fetch, componentId} = props || this.props;
      const restRoutes = routes ? routes.slice() : [];
      let {index, renderType} = this.state;
      let query = {};
      const key = refId.getPathArr()[0];
      const paths = refId.getPathArr().slice(1);
      renderType = 0;
      if (restRoutes.length === 0) {
        // block encounters the id with plugins will render!
        renderType = 0;
      } else if (restRoutes[0] === name) {
        restRoutes.shift();
        if (type === 'array') {
          if (restRoutes.length > 0) {
            // find recordIndex and just render their children
            if (paths.length === 0) {
              // first layer
              const recordId = restRoutes.shift();
              index = rootValue && rootValue.findIndex(record => record.get('_id') === recordId);
              if (index === -1) {
                query = {filter: {_id: {$eq: recordId}}};
              }
            } else {
              index = restRoutes.shift();
            }
            renderType = 1;
          }
          if (params.op === 'create') {
            // $FlowFixMe
            index = rootValue && rootValue.size - 1;
            renderType = 1;
          }
        }
      } else {
        renderType = 2;
      }
      this.setState({
        restRoutes,
        index: !index || index === -1 ? 0 : index,
        renderType,
        query,
        canRender: false
      });
      return fetch(key, componentId, {...this.props.query, ...query})
        .then(() => {
          this.setState({canRender: true});
        });
    }

    render() {
      const {refId, renderChildren} = this.props;
      const {renderType, canRender, index, restRoutes} = this.state;
      // const {op} = params;
      // id: arr/0/arr1
      // paths: ['0', 'arr1']
      if (!canRender) {
        return null;
      }
      if (renderType === 0) {
        return <Com {...this.props} routes={restRoutes} />;
      } else if (renderType === 1) {
        return <div>
          {renderChildren({refId: refId.child(String(index)), routes: restRoutes})}
        </div>;
      }
      
      return null;
    }
  };
}