import Parser from '../src/parser';
const parser = new Parser();

describe('parser', function() {
  it('parse plugin', function() {
    const schema = {
      type: 'string',
      ui: 'input',
      description: 'xxx',
    };
    const tree = {
      name: 'name',
      type: 'string',
      ui: 'input',
      nodeType: 'component.string.input',
      description: 'xxx',
      pattern: 'object.string',
      path: 'info/name',
    };
    expect(parser.parsePlugin('name', schema, {pattern: 'object', path: 'info'})).toMatchObject(tree);
  });

  it('object parse', function() {
    const schema = {
      type: 'object',
      items: {
        name: {
          type: 'string',
          ui: 'input',
        },
      },
    };
    const tree = {
      name: 'info',
      type: 'object',
      pattern: 'object',
      path: 'info',
      nodeType: 'component.object.fieldset',
      items: {
        name: {
          type: 'string',
          ui: 'input',
        },
      },
      children: [
        {
          name: 'name',
          nodeType: 'component.string.input',
          type: 'string',
          ui: 'input',
          pattern: 'object.string',
          path: 'info/name',
        },
      ],
    };
    expect(parser.parseObject('info', schema, {
      pattern: 'object',
      path: 'info',
    })).toMatchObject(tree);
  });

  it('array parse', function() {
    const schema = {
      type: 'array',
      ui: 'tab',
      items: {
        type: 'object',
        items: {
          name: {
            type: 'string',
            ui: 'input',
          },
        },
      },
    };
    const tree = {
      name: 'post',
      type: 'array',
      ui: 'tab',
      pattern: 'array',
      path: 'posts',
      nodeType: 'component.array.tab',
      items: {
        type: 'object',
        items: {
          name: {
            type: 'string',
            ui: 'input',
          },
        },
      },
      children: [
        {
          name: 'name',
          nodeType: 'component.string.input',
          type: 'string',
          ui: 'input',
          pattern: 'array.string',
          path: 'posts/name',
        },
      ],
    };
    expect(parser.parseArray('post', schema, {
      pattern: 'array',
      path: 'posts',
    })).toMatchObject(tree);
  });

  it('parse', function() {
    const schema = {
      info: {
        type: 'object',
        items: {
          name: {
            type: 'string',
            ui: 'input',
          },
        },
      },
    };
    const tree = {
      info: {
        pattern: 'object',
        path: 'info',
        name: 'info',
        nodeType: 'component.object.fieldset',
        type: 'object',
        items: {
          name: {
            type: 'string',
            ui: 'input',
          },
        },
        children: [{
          name: 'name',
          type: 'string',
          ui: 'input',
          nodeType: 'component.string.input',
          pattern: 'object.string',
          path: 'info/name',
        }],
      },
    };
    expect(parser.parse(schema, {
      pattern: 'array.string',
      path: 'posts/name',
    })).toMatchObject(tree);
  });
});
