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
      } else if (entitySchema.type === 'object') {
        this.ast[key] = this.parseObject(key, entitySchema, {
          pattern: 'object',
          path: key,
        });
      } else if (entitySchema.type === 'page') {
        this.ast[key] = this.parsePage(key, entitySchema, {
          pattern: 'page',
          path: key,
        });
      } else {
        throw new Error('Entity schema type shoule be one of ["object", "array", "page"]');
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
      nodeType: generateNodeType(schema),
      children: Object.keys(children).map((key) => this.parsePlugin(key, children[key], state)),
      pattern: state.pattern,
      path: state.path,
      ui: ui,
    };
  }

  parseJson(key: string, schema: Schema, state: State): ParentNode {
    let children = {};
    if (schema.type !== 'json') {
      throw new Error(`${key} is not a json schema`);
    }

    children = schema.items || {};
    const ui = schema.ui || getDefaultUI(schema.type);
    return {
      ...schema,
      name: key,
      nodeType: generateNodeType(schema),
      children: Object.keys(children).map((key) => this.parsePlugin(key, children[key], state)),
      pattern: state.pattern,
      path: state.path,
      ui: ui,
    };
  }

  parsePage(key: string, schema: Schema, state: State): ParentNode {
    let children = {};
    if (schema.type !== 'page') {
      throw new Error(`${key} is not a page schema`);
    }

    children = schema.items || {};
    const ui = schema.ui || getDefaultUI(schema.type);
    return {
      ...schema,
      name: key,
      nodeType: generateNodeType(schema),
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
        nodeType: generateNodeType(schema),
        children: Object.keys(children).map((key) => this.parsePlugin(key, children[key], state)),
        pattern: state.pattern,
        path: state.path,
        ui,
      };
    }

    return {
      ...schema,
      name: key,
      nodeType: generateNodeType(schema),
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

    if (schema.type === 'json') {
      return this.parseJson(key, schema, {
        pattern: `${pattern}.json`,
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
      nodeType: generateNodeType(schema),
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
      return 'default';
  }
}


function generateNodeType(schema: Schema) {
  const ui = schema.ui || getDefaultUI(schema.type);
  let nodetype = 'component';
  if (['page', 'component'].indexOf(schema.type) !== -1) {
    nodetype = 'page';
  }
  return `${nodetype}.${schema.type}.${ui}`;
}