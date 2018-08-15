/** @jsx builder */

// eslint-disable-next-line
import builder, {Layout, Block, configure} from '../src'
import {CANNER_KEY, createLayoutVisitor} from '../src/layout';

configure({
  visitorManager: {
    defaultVisitors: []
  }
});

describe('insertion layout', () => {
  let node, node2;
  beforeEach(() => {
    node = {
      type: 'string',
      keyName: 'name',
      title: 'Name',
      description: 'Desc'
    };
    node2 = {
      type: 'string',
      keyName: 'nickname',
      title: 'Nickname',
      description: 'Desc'
    };
  })

  it(`
    <Layout> <--- this layout
      <string />
    </Layout>
  , should create layout visitor`, () => {
    const {visitor, cannerKey} = createLayoutVisitor({
      component: 'block'
    }, [{
      type: 'string',
      keyName: 'name'
    }]);
    node[CANNER_KEY] = [cannerKey];
    const mockSetChildren = jest.fn();
    const fakePath = {
      route: 'body.0',
      node: {
        children: [node]
      },
      parent: {},
      tree: {
        setChildren: mockSetChildren,
      }
    }
    visitor['plugins.object.fieldset'].exit(fakePath);
    // route
    expect(mockSetChildren.mock.calls[0][0]).toBe('body.0');
    // new children
    expect(mockSetChildren.mock.calls[0][1]).toMatchObject([{
      nodeType: 'layout',
      childrenName: [node.keyName],
      children: [node],
      
    }]);
  });

  it(`
    <Layout> <-- this layout
      <string />
      <string />
    </Layout>,
  should create layout visitor`, () => {
    const {visitor, cannerKey} = createLayoutVisitor({
      component: 'block'
    }, [{
      type: 'string',
      keyName: 'name'
    }, {
      type: 'string',
      keyName: 'nickname'
    }]);
    node[CANNER_KEY] = [cannerKey];
    node2[CANNER_KEY] = [cannerKey];
    const mockSetChildren = jest.fn();
    const fakePath = {
      route: 'body.0',
      node: {
        children: [node, node2]
      },
      tree: {
        setChildren: mockSetChildren,
      }
    }
    visitor['plugins.object.fieldset'].exit(fakePath);
    // route
    expect(mockSetChildren.mock.calls[0][0]).toBe('body.0');
    // new node
    expect(mockSetChildren.mock.calls[0][1]).toMatchObject([{
      nodeType: 'layout',
      childrenName: [node.keyName, node2.keyName],
      children: [node, node2],
      
    }]);
  });

  it(`
    <Layout> <-- this layout
      <object>
        <string />
      </object>
      <string />
    </Layout>,
   one is object, should create layout visitor`, () => {
    const {visitor, cannerKey} = createLayoutVisitor({
      component: 'block'
    }, [{
      type: 'object',
      name: 'info',
      items: {
        name: {
          type: 'string',
          keyName: 'name'
        }
      }
    }, {
      type: 'string',
      keyName: 'nickname'
    }]);
    node = {
      type: 'object',
      name: 'info',
      description: 'Info',
      [CANNER_KEY]: cannerKey,
      items: {
        name: {
          type: 'string',
          keyName: 'name'
        }
      }
    }
    node2[CANNER_KEY] = [cannerKey];
    const mockSetChildren = jest.fn();
    const fakePath = {
      route: 'body.0',
      node: {
        children: [node, node2]
      },
      tree: {
        setChildren: mockSetChildren,
      }
    }
    visitor['plugins.object.fieldset'].exit(fakePath);
    // route
    expect(mockSetChildren.mock.calls[0][0]).toBe('body.0');
    // new node
    expect(mockSetChildren.mock.calls[0][1]).toMatchObject([{
      nodeType: 'layout',
      childrenName: [node.keyName, node2.keyName],
      children: [node, node2],
      
    }]);
  });

  it(`
    <Layout> <-- this layout
      <string />
    </Layout>
     <string />,
   silibing doesnt have cannerkey should create layout visitor`, () => {
    const {visitor, cannerKey} = createLayoutVisitor({
      component: 'block'
    }, [{
      type: 'string',
      keyName: 'name'
    }]);
    node[CANNER_KEY] = [cannerKey];
    const mockSetChildren = jest.fn();
    const fakePath = {
      route: 'body.0',
      node: {
        children: [node, node2]
      },
      parent: {},
      tree: {
        setChildren: mockSetChildren,
      }
    }
    visitor['plugins.object.fieldset'].exit(fakePath);
    // route
    expect(mockSetChildren.mock.calls[0][0]).toBe('body.0');
    // new node
    expect(mockSetChildren.mock.calls[0][1].length).toBe(2);
    expect(mockSetChildren.mock.calls[0][1]).toMatchObject([{
      nodeType: 'layout',
      childrenName: [node.keyName],
      children: [node],
      
    }, {
      description: 'Desc',
      keyName: 'nickname',
      title: 'Nickname',
      type: 'string'
    }]);
  });
});

describe('injection layout', () => {
  let node, node2, injectBlock;
  beforeEach(() => {
    node = {
      keyName: 'name',
      type: 'string',
    };
    node2 = {
      keyName: 'nickname',
      type: 'string'
    }
    injectBlock = {
      name: 'label',
      layoutType: 'injection',
      injectValue: {
        vertical: true
      }
    };
  });

  it('should change node value', () => {
    const {cannerKey, visitor} = createLayoutVisitor(injectBlock, [node]);
    node[CANNER_KEY] = [cannerKey];
    visitor['plugins.string']({node});
    expect(node.vertical).toBe(true);
    visitor['plugins.string']({node: node2});
    expect(node2.vertical).not.toBe(true);
  });

  it('should change node and node2 value', () => {
    const {cannerKey, visitor} = createLayoutVisitor(injectBlock, [node, node2]);
    node[CANNER_KEY] = [cannerKey];
    node2[CANNER_KEY] = [cannerKey];
    visitor['plugins.string']({node});
    expect(node.vertical).toBe(true);
    visitor['plugins.string']({node: node2});
    expect(node2.vertical).toBe(true);
  });
});

describe('script handle layout', () => {
  it('should throw error when no component', () => {
    let createSchema = () => (
      <Layout>
        <string keyName="name"/>
      </Layout>
    );
    expect(createSchema).toThrow(/component/);
  });

  it('should declare layout works', () => {
    let createSchema = () => {
      // eslint-disable-next-line
      const Card = props => <Layout component={() => '123'} {...props} />;
      return <Card test="321">
        <string keyName="name"/>
      </Card>;
    };
    expect(createSchema).not.toThrow();
  });

  it('should default layout works', () => {
    let createSchema = () => {
      return <Block test="321">
        <string keyName="name"/>
      </Block>;
    };
    expect(createSchema).not.toThrow();
  });

  it('empty children in layout should throw', () => {
    let createSchema = () => {
      return <Layout test="321" keyName="test">
      </Layout>;
    };
    expect(createSchema).toThrow(/at least/);
  });

  it('Layout should return children with cannerKey 1', () => {
    let schema = (
      <Layout component="test">
        <string keyName="name"/>
      </Layout>
    );
    expect(schema).toMatchObject([{
      type: 'string',
      keyName: 'name',
      [CANNER_KEY]: expect.anything()
    }]);
  });

  it('Layout should return children with cannerKey 2', () => {
    const schema = (
      <Layout component="test">
        <string keyName="name"/>
        <string keyName="name2"/>
      </Layout>
    );
    expect(schema).toMatchObject([{
      type: 'string',
      keyName: 'name',
    }, {
      type: 'string',
      keyName: 'name2',
    }]);
    expect(schema[0]).toHaveProperty(CANNER_KEY);
  });

  it('Layout should return children with cannerKey 3', () => {
    const schema = (
      <Layout component="test">
        <string keyName="name"/>
        <Layout component="test">
          <string keyName="name2"/>
        </Layout>
      </Layout>
    );
    expect(schema).toMatchObject([{
      type: 'string',
      keyName: 'name',
    }, {
      type: 'string',
      keyName: 'name2',
    }]);
    expect(schema[0]).toHaveProperty(CANNER_KEY);
  });

  it('Layout should return children with cannerKey 4', () => {
    const schema = (
      <Layout component="test">
        <Layout component="test">
          <string keyName="name"/>
          <string keyName="name2"/>
        </Layout>
      </Layout>
    );
    expect(schema).toMatchObject([{
      type: 'string',
      keyName: 'name',
    }, {
      type: 'string',
      keyName: 'name2',
    }]);
    expect(schema[0]).toHaveProperty(CANNER_KEY);
  });

  it('root export visitors', () => {
    configure({
      visitorManager: {
        visitors: []
      }
    })
    const schema = (
      <root>
        <object keyName="info">
          <Layout component="test">
            <string keyName="name" />
          </Layout>
        </object>
      </root>
    );
    expect(schema).toMatchObject({
      schema: {
        info: {
          type: 'object',
          items: {
            name: {
              type: 'string',
            }
          }
        }
      },
      visitors: [{
        'plugins.object.fieldset': {
          exit: expect.any(Function)
        }
      }]
    })
  });
})
