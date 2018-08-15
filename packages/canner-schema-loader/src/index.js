import {getOptions, stringifyRequest} from 'loader-utils';
import path from 'path';
import objectPath from 'object-path';
import Module from 'module';
import fs from 'fs';
import stripBOM from 'strip-bom';

const componentMap = {
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
function nullReplace(match, type) {
  const packageName = componentMap.get(type);
  return match.replace('null', `{packageName: '${packageName}'}`);
}
function getPackageName(match, type, attrs) {
  const result = /ui: ['"](\w+)['"]/.exec(match);
  let packageName = '';
  if (result === null) {
    packageName = componentMap.get(type);
  } else {
    packageName = componentMap.get(type, result[1]);
  }
  if (!packageName) {
    return match;
  }
  if (attrs === 'null') {
    return match.replace(/['"](string|number|boolean|array|object|relation|geoPoint|dateTime|image)['"], null/g, nullReplace);
  } else {
    var braceIndex = match.indexOf('{');
    if (braceIndex === -1) {
      return match;
    }
    return `${match.substring(0, braceIndex + 1)}packageName: '${packageName}', ${match.substring(braceIndex + 1)}`;
  }
}

function packageNameTemplate(match, source, context) {
  /** fieldset is not a real component, so return its name, and Generator will deal with it */
  if (!source || source.endsWith('@canner/antd-object-fieldset')) {
    return match;
  }
  let packageName = source;
  if (packageName.startsWith('.') || packageName.startsWith('/')) {
    // customize component
    packageName = path.resolve(context.context, source);
  } else {
    // deployed component
    const paths = require.resolve(packageName).split(path.sep);
    const dirPathIndex = paths.indexOf(packageName);
    packageName = paths.slice(0, dirPathIndex - 1).join('/');
  }
  const loader = ['new Promise((resolve) => {',
    'require.ensure([], (require) => {',
      `resolve(require("${packageName}"));`,
    '});',
  '})'].join('');
  let builder;
  const defFile = `${packageName}/canner.def.js`;
  if (fs.existsSync(defFile)) {
    // to check defFile is exist or not, if not this line will throw an error
    builder = `require("${defFile}").default ? require("${defFile}").default : require("${defFile}")`;
  } else {
    builder = undefined;
  }

  let canner = {};
  try {
    canner = require(`${packageName}/package.json`).canner || {};
  } catch (e) {
    canner = {};
  }
  canner = Object.keys(canner).reduce((result, key, currentIndex, arr) => {
    const last = arr.length - 1 === currentIndex;
    if (key === 'cannerDataType') {
      result += `type: '${canner[key]}'${last ? '' : ','}`;
    } else {
      result += `${key}: ${typeof canner[key] === 'string' ? `'${canner[key]}'` : canner[key]}${last ? '' : ','}`;
    }
    return result;
  }, '');
  return [`packageName: '${packageName}',`,
    `loader: ${loader}`,
    `${builder ? `, builder: ${builder}` : ''}${canner ? `, ${canner}`: ''}`
  ].join('');
}

export default function loader(source) {
  const options = getOptions(this);
  const cannerComponentMap = {};
  // get type and ui and add packagename in code
  let str = replaceTypeAndUItoPackageName(source);
  // transform packageName to loader, builder, and other attributes in package.json
  str = replacePackageNameToDynamicImport(str, this);
  return str;
}

function replacer(key, val) {
  if (key === '__CANNER_KEY__') {
    return [];
  }

  return val;
}

export function replaceTypeAndUItoPackageName(str) {
  return str.replace(/\s*?['"](string|number|boolean|array|object|relation|geoPoint|dateTime|image)['"],\s*?(({\s*?((?!(packageName)).|\s)*?})|null)/g, getPackageName);
}

export function replacePackageNameToDynamicImport(str, that) {
  return str.replace(/packageName: ['"]([\w\/\-\@\.]+)['"]/g, (match, name) => packageNameTemplate(match, name, that))
}
