// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import type {List} from 'immutable';
type Props = {
  type: string,
  routes: Array<string>,
  rootValue: List<any>,
  name: string,
  id: string,
  params: any,
  renderChildren: ({[string]: any}) => React.Node
};

type State = {
  restRoutes: Array<string>,
  index: number | string,
  renderType: 0 | 1,
  query: any,
  canRender: boolean,
}

// $FlowFixMe
export default function withRoute(Com: React$Component<*>) {
  return class ComponentWithRoute extends React.Component<Props, State> {
    static contextTypes = {
      deploy: PropTypes.func,
      fetch: PropTypes.func,
      query: PropTypes.shape({
        filter: PropTypes.any,
        sort: PropTypes.any,
        pagination: PropTypes.any
      }),
      componentId: PropTypes.string
    }

    static childContextTypes = {
      query: PropTypes.shape({
        filter: PropTypes.any,
        sort: PropTypes.any,
        pagination: PropTypes.any
      })
    }

    getChildContext() {
      return {
        query: {...this.context.query, ...this.state.query}
      };
    }

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

    updateState = (props: Props) => {
      const {type, rootValue, name, id, params, routes} = props;
      const restRoutes = routes ? routes.slice() : [];
      let {index, renderType} = this.state;
      let query = {};
      const key = id.split('/')[0];
      const paths = id.split('/').slice(1);
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
            const valuePath = ((id.split('/').slice(1): any): Array<string | number>);
            valuePath[0] = Number(valuePath[0]);
            // $FlowFixMe
            index = rootValue && rootValue.getIn(valuePath).size - 1;
            renderType = 1;
          }
        }
      }
      this.setState({
        restRoutes,
        index: !index || index === -1 ? 0 : index,
        renderType,
        query,
        canRender: false
      });
      this.context.fetch(key, this.context.componentId, {...this.context.query, ...query})
        .then(() => {
          this.setState({canRender: true});
        });
    }

    render() {
      const {id, renderChildren} = this.props;
      const {renderType, canRender, index, restRoutes} = this.state;
      console.log(renderType);
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
          {renderChildren({id: `${id}/${index}`, routes: restRoutes})}
        </div>;
      }
      
      return null;
    //   if (restRoutes.length === 0) {
    //     // block encounters the id with plugins will render!
    //     return <Com {...this.props} routes={restRoutes} />;
    //   } else if (restRoutes[0] === name) {
    //     restRoutes.shift();
    //     if (type === 'array') {
    //       if (restRoutes.length > 0) {
    //         let recordIndex = 0;
    //         // find recordIndex and just render their children
    //         if (paths.length === 0) {
    //           // first layer
    //           const recordId = restRoutes.shift();
    //           recordIndex = rootValue.findIndex(record => record.get('_id') === recordId);
    //         } else {
    //           recordIndex = restRoutes.shift();
    //         }

    //         return <div>
    //           {renderChildren({id: `${id}/${recordIndex}`, routes: restRoutes})}
    //         </div>;
    //         // return <Com {...this.props} routes={restRoutes} openIndex={recordIndex} />;
    //       }
    //       if (params.op === 'create') {
    //         const size = rootValue.getIn(id.split('/').slice(1)).size - 1;
    //         return <div>
    //           {renderChildren({id: `${id}/${size}`, routes: restRoutes})}
    //         </div>;
    //       }
    //       return <Com {...this.props} routes={restRoutes} />;
    //     }
    //     return <Com {...this.props} routes={restRoutes} />;
    //   }
    //   return null;
    // }
    }
  };
}