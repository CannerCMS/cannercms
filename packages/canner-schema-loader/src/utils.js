import objectPath from 'object-path';
export const componentMap = {
  _map: {
    string: {
      input: '@canner/antd-string-input',
      card: '@canner/antd-string-card',
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
      fieldset: '', // no package
      default: '' // no package
    },
    relation: {
      singleSelect: '@canner/antd-relation-single_select',
      multipleSelect: '@canner/antd-relation-multiple_select',
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
    }
  },
  get: function(type, ui = 'default') {
    if (!(type in this._map)) {
      return undefined;
    }

    if (!(ui in this._map[type])) {
      throw new Error(`there is no ui ${ui} in type ${type}`);
    }

    return objectPath.get(this._map, `${type}.${ui}`, ui);
  },
  set: function(path, name) {
    const paths = path.split('.');
    objectPath.set(this._map, paths, name);
  }
};