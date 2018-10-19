/** @jsx builder */
// @flow

import {
  StringModel,
  NumberModel,
  BooleanModel,
  ArrayModel,
  ObjectModel,
  GeoPointModel,
  DateModel,
  FileModel,
  RootModel,
  RelationModel,
  ImageModel,
  ComponentModel,
  EnumModel,
  PageModel,
  JsonModel
} from './models';
import type {CannerSchema, Props} from './flow-types';
import {createLayoutVisitor, CANNER_KEY} from './layout';
import visitorManager from './visitorManager';
import validator from './validator';
import configuration from './configure';
import {getIntlMessage} from './utils';

// layout
export const Layout = 'Layout';
export const Collapse = ({attributes, children}: Props) => <Layout ui="collapse" {...attributes}>{children}</Layout>;
export const Block = ({attributes, children}: Props) => <Layout ui="block" {...attributes}>{children}</Layout>;
export const Default = ({attributes, children}: Props) => <Layout ui="default" {...attributes}>{children}</Layout>;
export const Tabs = ({attributes, children}: Props) => <Layout ui="tabs" {...attributes}>{children}</Layout>;
export const Focus = ({attributes, children}: Props) => <Layout ui="focus" {...attributes}>{children}</Layout>;
export const Condition = ({attributes, children}: Props) => <Layout ui="condition" {...attributes}>{children}</Layout>;
export const Row = ({attributes, children}: Props) => <Layout ui="row" {...attributes}>{children}</Layout>;
export const Col = ({attributes, children}: Props) => <Layout ui="col" {...attributes}>{children}</Layout>;

// validator config
export const configure = configuration.configure;

// jsx pragma
export default function builder(tag: string | Function, attributes: Object, ...children: Array<CannerSchema>) {
  // flattern children
  children = children.reduce((result, child) => result.concat(child), [])
    .filter(child => child);
  children = (attributes || {}).children || children;
  if (typeof tag === 'function') {
    return tag({
      attributes,
      children
    });
  }
  attributes = attributes || {};
  // transform some value to react intl component
  i18n(attributes);
  switch(tag) {
    case 'string':
      return createJSON(StringModel, [attributes, children]);
    case 'number':
      return createJSON(NumberModel, [attributes, children]);
    case 'boolean':
      return createJSON(BooleanModel, [attributes, children]);
    case 'array':
      return createJSON(ArrayModel, [attributes, children]);
    case 'object':
      return createJSON(ObjectModel, [attributes, children]);
    case 'arrayType':
      return createJSON(ArrayModel, [{...attributes, defOnly: true}, children]);
    case 'objectType':
      return createJSON(ObjectModel, [{...attributes, defOnly: true}, children]);
    case 'geoPoint':
      return createJSON(GeoPointModel, [attributes, children]);
    case 'dateTime':
      return createJSON(DateModel, [attributes, children]);
    case 'file':
      return createJSON(FileModel, [attributes, children]);
    case 'image':
      return createJSON(ImageModel, [attributes, children]);
    case 'relation':
      return createJSON(RelationModel, [attributes, children]);
    case 'json':
      return createJSON(JsonModel, [attributes, children]);
    case 'component':
      return createJSON(ComponentModel, [attributes, children]);
    case 'enum':
      return new createJSON(EnumModel, [attributes, children]);
    case 'page':
      return new PageModel(attributes, children).toJson();
    case 'root':
      return new RootModel(attributes, children).toJson();
    case 'toolbar': {
      return children.reduce((result, child) => {
        result[child.type] = {
          ...child
        };
        return result;
      }, {
        ...attributes,
        __TOOLBAR__: true
      });
    }
    case 'sorter': {
      return {
        ...attributes,
        type: 'sorter'
      }
    }
    case 'pagination': {
      return {
        ...attributes,
        type: 'pagination'
      }
    }
    case 'textFilter': {
      return {
        ...attributes,
        type: 'text'
      };
    }
    case 'numberFilter': {
      return {
        ...attributes,
        type: 'number'
      };
    }
    case 'dateFilter': {
      return {
        ...attributes,
        type: 'date'
      };
    }
    case 'relationSelectFilter': {
      return {
        ...attributes,
        type: 'relation'
      };
    }
    case 'selectFilter': {
      return {
        ...attributes,
        type: 'select'
      };
    }
    case 'filter': {
      return {
        ...attributes,
        type: 'filter',
        filters: children
      };
    }
    case 'actions': {
      return {
        ...attributes,
        ...children.reduce((result, child) => {
          result[child.type] = child;
          return result;
        }, {}),
        type: 'actions'
      };
    }
    case 'export': {
      return {
        ...attributes,
        type: 'export'
      };
    }
    case 'import': {
      return {
        ...attributes,
        type: 'import'
      };
    }
    case 'Layout': {
      const {visitor, cannerKey} = createLayoutVisitor(attributes, children);
      let injectLayout;
      if (attributes.injectValue) {
        injectLayout = createLayoutVisitor({...attributes, layoutType: 'injection'}, children);
      }
      visitorManager.addVisitor(visitor);
      if (injectLayout) {
        visitorManager.addVisitor(injectLayout.visitor);
      }
      return children.map(child => {
        if (child[CANNER_KEY]) {
          child[CANNER_KEY].push(cannerKey);
        } else {
          child[CANNER_KEY] = [cannerKey];
        }

        if (injectLayout) {
          child[CANNER_KEY].push(injectLayout.cannerKey);
        }
        return child;
      });
    }
    default:
      throw new Error(`unsupported type '${tag}'`);
  }
}

function createJSON(Model: any, args: Array<*>) {
  let json = new Model(...args).toJson();
  validator.validate(json);
  return json;
}

function i18n(attrs: Object) {
  ['title', 'description', 'uiParams', 'label', 'options', 'placeholder'].forEach(key => {
    if (key in attrs) {
      attrs[key] = getIntlMessage(attrs[key]);
    }
  });
}
