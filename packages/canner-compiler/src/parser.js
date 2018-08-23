// @flow

type State = {
  path: string;
  pattern: string;
}
import type {Tree, NodeType, Schema, ParentNode} from './types';


export default class Parser {
  ast: Tree;
  constructor() {
    this.ast = {
    };
  }

  parse(schema: Schema): Tree {
    Object.keys(schema).forEach((key) => {
      const entitySchema = schema[key];
      if (entitySchema.type === 'array') {
        this.ast[key] = this.parseArray(key, entitySchema, {
          pattern: 'array',
          path: key,
        });
      } else {
        this.ast[key] = this.parseObject(key, entitySchema, {
          pattern: 'object',
          path: key,
        });
      }
    });
    return this.ast;
  }

  parseObject(key: string, schema: Schema, state: State): ParentNode {
    let children = {};
    if (schema.type !== 'object') {
      throw new Error(`${key} is not a object schema`);
    }

    children = schema.items || {};
    const ui = schema.ui || getDefaultUI(schema.type);
    return {
      ...schema,
      name: key,
      nodeType: `components.${schema.type}.${ui}`,
      children: Object.keys(children).map((key) => this.parsePlugin(key, children[key], state)),
      pattern: state.pattern,
      path: state.path,
      ui: ui,
    };
  }

  parseArray(key: string, schema: Schema, state: State): NodeType {
    if (schema.type !== 'array') {
      throw new Error(`${key} is not a object schema`);
    }
    if (schema.items) {
      const children = schema.items.items || {};
      const ui = schema.ui || getDefaultUI(schema.type);
      return {
        ...schema,
        name: key,
        nodeType: `components.${schema.type}.${ui}`,
        children: Object.keys(children).map((key) => this.parsePlugin(key, children[key], state)),
        pattern: state.pattern,
        path: state.path,
        ui,
      };
    }

    return {
      ...schema,
      name: key,
      nodeType: `components.${schema.type}.${schema.ui}`,
      pattern: state.pattern,
      path: state.path,
    };
  }

  parsePlugin(key: string, schema: Schema, state: State): NodeType {
    const {path, pattern} = state;
    if (schema.type === 'object') {
      return this.parseObject(key, schema, {
        pattern: `${pattern}.object`,
        path: `${path}/${key}`,
      });
    }

    if (schema.type === 'array') {
      return this.parseArray(key, schema, {
        pattern: `${pattern}.array`,
        path: `${path}/${key}`,
      });
    }

    const ui = schema.ui || getDefaultUI(schema.type);

    return {
      ...schema,
      name: key,
      nodeType: `components.${schema.type}.${ui}`,
      pattern: `${pattern}.${schema.type}`,
      path: `${path}/${key}`,
      ui,
    };
  }
}

function getDefaultUI(type: string) {
  switch (type) {
    case 'array':
      return 'tab';
    case 'number':
    case 'string':
      return 'input';
    case 'boolean':
      return 'switch';
    case 'object':
      return 'fieldset';
    case 'relation':
      return 'one';
    default:
      return '';
  }
}
