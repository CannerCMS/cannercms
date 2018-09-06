// @flow
import objectPath from 'object-path';
import {RootModel} from './models';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';

// this componentMap is the default component in CannerCMS
export const componentMap = {
  _map: {
    string: {
      input: '@canner/antd-string-input',
      card: '@canner/antd-string-card',
      editor: '@canner/antd-string-editor',
      link: '@canner/antd-string-link',
      radio: '@canner/antd-string-radio',
      select: '@canner/antd-string-select',
      textarea: '@canner/antd-string-textarea',
      time: '@canner/antd-string-time_picker',
      markdown: '@canner/antd-string-mde',
      default: '@canner/antd-string-input'
    },
    number: {
      input: '@canner/antd-number-input',
      rate: '@canner/antd-number-rate',
      slider: '@canner/antd-number-slider',
      default: '@canner/antd-number-input'
    },
    array: {
      tab: '@canner/antd-array-tabs',
      tabs: '@canner/antd-array-tabs',
      tabTop: '@canner/antd-array-tab_top',
      tabRight: '@canner/antd-array-tab_right',
      tabLeft: '@canner/antd-array-tab_left',
      tabBottom: '@canner/antd-array-tab_bottom',
      gallery: '@canner/antd-array-gallery',
      table: '@canner/antd-array-table',
      slider: '@canner/antd-array-slider',
      panel: '@canner/antd-array-panel',
      tag: '@canner/antd-array-tag',
      tableRoute: '@canner/antd-array-table_route',
      tree: '@canner/antd-array-tree',
      default: '@canner/antd-array-table'
    },
    object: {
      variants: '@canner/antd-object-variants',
      options: '@canner/antd-object-options',
      editor: '@canner/antd-object-editor',
      fieldset: '@canner/antd-object-fieldset',
      default: '@canner/antd-object-fieldset'
    },
    relation: {
      singleSelect: '@canner/antd-relation-single_select',
      multipleSelect: '@canner/antd-relation-multiple_select',
      multipleSelectTree: '@canner/antd-relation-multiple_select_tree',
      singleSelectTree: '@canner/antd-relation-single_select_tree',
      default: '@canner/antd-relation-single_select'
    },
    boolean: {
      switch: '@canner/antd-boolean-switch',
      card: '@canner/antd-boolean-card',
      default: '@canner/antd-boolean-switch'
    },
    geoPoint: {
      default: '@canner/antd-object-map'
    },
    file: {
      file: '@canner/antd-object-image',
      default: '@canner/antd-object-image'
    },
    image: {
      image: '@canner/antd-object-image',
      default: '@canner/antd-object-image'
    },
    dateTime: {
      dateTime: '@canner/antd-string-date_time_picker', 
      default: '@canner/antd-string-date_time_picker'
    },
    chart: {
      line: '@canner/vega-chart-line',
      bar: '@canner/vega-chart-bar',
      pie: '@canner/vega-chart-pie',
      scatter: '@canner/vega-chart-scatter',
      default: '@canner/vega-chart-line'
    },
    indicator: {
      list: '@canner/antd-indicator-list',
      amount: '@canner/antd-indicator-amount',
      default: '@canner/antd-indicator-amount'
    },
    enum: {
      select: '@canner/antd-string-select',
      radio: '@canner/antd-string-radio',
      default: '@canner/antd-string-select'
    }
  },
  get: function(type: string, ui: string = 'default') {
    if (!(type in this._map)) {
      throw new Error(`there is no type ${type}`);
    }

    if (!(ui in this._map[type])) {
      throw new Error(`there is no ui ${ui}`);
    }

    return objectPath.get(this._map, `${type}.${ui}`, ui);
  },
  set: function(path: string, name: string) {
    const paths = path.split('.');
    objectPath.set(this._map, paths, name);
  }
};

export function parseGraphqlClient(attributes: Object, children: Array<Object>) {
  const defaultGraphqlClient = attributes.graphqlClient;
  const hasGraphqlClientOnKey = children.find(child => child.graphqlClient);
  return hasGraphqlClientOnKey ?
    undefined :
    defaultGraphqlClient;
}

export function parseGraphqlClients(attributes: Object, children: Array<Object>) {
  const defaultGraphqlClient = attributes.graphqlClient;
  const hasGraphqlClientOnKey = children.find(child => child.graphqlClient);
  if (hasGraphqlClientOnKey) {
    return children.reduce((result, child) => {
      if (child.graphqlClient) {
        result[child.keyName] = child.graphqlClient;
      } else {
        result[child.keyName] = defaultGraphqlClient;
      }
      return result;
    }, {});
  }
  return undefined;
}

export function parseConnector(attributes: Object, children: Array<Object>) {
  const defaultConnector = attributes.connector;
  const hasConnectorOnKey = children.find(child => child.connector);
  return hasConnectorOnKey ?
    undefined :
    defaultConnector;
}

export function parseConnectors(attributes: Object, children: Array<Object>) {
  const defaultConnector = attributes.connector;
  const hasConnectorOnKey = children.find(child => child.connector);
  if (hasConnectorOnKey) {
    return children.reduce((result, child) => {
      if (child.connector) {
        result[child.keyName] = child.connector;
      } else {
        result[child.keyName] = defaultConnector;
      }
      return result;
    }, {});
  }
  return undefined;
}

export function parseResolvers(attributes: Object, children: Array<Object>) {
  const resolverOnRoot = attributes.resolver;
  if (resolverOnRoot) {
    if (typeof resolverOnRoot !== 'object') {
      throw new Error('the resolver on root should be a resolver map');
    }
    return resolverOnRoot;
  } else {
    return children.reduce((result, child) => {
      if (child.resolver) {
        result[child.keyName] = child.resolver;
      }
      return result;
    }, {});
  }
}

export function parseSchema(attributes: Object, children: Array<Object>) {
  const root = new RootModel(attributes, children);
  return root.toJson();
}

export function getIntlMessage(attributes: Object, key: string) {
  const value = attributes[key];
  const matched = typeof value === 'string' && value.match(/\$\{(.*)\}/);
  if (matched) {
    return <FormattedMessage
      id={matched[1]}
      defaultMessage={value}
    />;
  }
  return value;
}
