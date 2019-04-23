/** @jsx builder */
import builder, {Block} from '../src';
import compiler from 'canner-compiler';
import serializer from './serializer';
expect.addSnapshotSerializer(serializer);
const {Traverser, Parser} = compiler;
function compile(schema, visitors) {
  const parser = new Parser();
  const tree = parser.parse(schema);
  const traverser = new Traverser(tree);
  visitors.forEach(visitor => {
    traverser.addVisitor(visitor);
  });
  const componentTree = traverser.traverse();
  return componentTree;
}

describe('integration with qa-compiler, test object', () => {
  it(`integration 1`, () => {
    const {schema, visitors} = <root>
      <object keyName="info">
        <Block>
          <string keyName="name"/>
        </Block>
      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`integration 2`, () => {
    const {schema, visitors} = <root>
      <object keyName="info">
        <Block>
          <string keyName="name"/>
        </Block>
        <string keyName="nickname"/>
      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`integration 3`, () => {
    const {schema, visitors} = <root>
      <object keyName="info">
        <Block>
          <string keyName="name"/>
          <string keyName="nickname"/>
        </Block>
      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`integration 4`, () => {
    const {schema, visitors} = <root>
      <object keyName="info">
        <Block>
          <object keyName="info1">
            <string keyName="name"/>
          </object>
        </Block>
      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`integration 5`, () => {
    const {schema, visitors} = <root>
      <object keyName="info">
        <Block>
          <object keyName="info1">
            <Block>
              <string keyName="name"/>
            </Block>
          </object>
        </Block>
      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`
  integration 6`, () => {
    const {schema, visitors} = <root>
      <object keyName="info">
        <object keyName="info1">
          <Block>
            <object keyName="info2">
              <string keyName="name3"/>
            </object>
          </Block>
        </object>
      </object>
      
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`integration 7`, () => {
    const {schema, visitors} = <root>
      <object keyName="info" title="Info">
        <Block>
          <string keyName="name" title="Name" />
          <string keyName="description" title="Desc" />
        </Block>
        <object keyName="info" title="Info">
          <object keyName="info2" title="Info2">
            <string keyName="name2" title="Name" />
          </object>
        </object>

      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`integration 8`, () => {
    const {schema, visitors} = <root>
      <object keyName="info" title="Info">
        <Block>
          <string keyName="name" title="Name" />
          <string keyName="description" title="Desc" />
        </Block>
        <object keyName="info" title="Info">
          <object keyName="info2" title="Info2">
            <Block>
              <string keyName="name2" title="Name" />
            </Block>
          </object>
        </object>
      </object>
      <array keyName="info3" title="Info3">
        <Block>
          <string keyName="name" title="Name" />
          <string keyName="description" title="Desc" />
        </Block>
        <object keyName="info" title="Info">
          <object keyName="info2" title="Info2">
            <string keyName="name2" title="Name" />
          </object>
        </object>
      </array>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it(`integration 9`, () => {
    const {schema, visitors} = <root>
      <object keyName="info">
        <Block>
          <Block>
            <string keyName="name"/>
          </Block>
        </Block>
      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });
});

describe('array', () => {
  it('integration 1', () => {
    const {schema, visitors} = <root>
      <array keyName="posts">
        <object keyName="status">
          <Block>
            <boolean keyName="isDraft" />
          </Block>
        </object>
      </array>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  })

  it('integration 2', () => {
    const {schema, visitors} = <root>
      <array keyName="posts">
        <Block>
          <string keyName="content" />
          <object keyName="buttons">
            <boolean keyName="isDraft" />
          </object>
          <object keyName="otherinfo">
            <string keyName="address" />
            <string keyName="introduction" />
          </object>
        </Block>
      </array>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  })
})


describe('complex schema', () => {
  it('integration 1', () => {
    const {schema, visitors} = <root>
      <array keyName="posts" title="Posts">
        <object keyName="status">
          <dateTime keyName="createAt" />
          <number keyName="draft" />
        </object>
        <string keyName="featureImage" />
        <object keyName="pageProperty">
          <number keyName="onTop" />
          <number keyName="order" />
        </object>
        <object keyName="share">
          <number keyName="showShareBottom" />
          <number keyName="showGoodBottom" />
        </object>
        <object keyName="other">
          <string keyName="introduction" />
          <geoPoint keyName="position" />
        </object>
      </array>
      <object keyName="info" title="Info">
        <Block>
          <string keyName="name" title="Name" />
          <string keyName="description" title="Desc" />
        </Block>
        <object keyName="info" title="Info">
          <object keyName="info2" title="Info2">
            <string keyName="name2" title="Name" />
          </object>
        </object>
      </object>
      <array keyName="popup" title="Popup">
        <string keyName="name" title="Name" />
      </array>
      <array ui="tab" keyName="tab" title="Tab">
        <string keyName="name" title="Name" />
      </array>
      <array
        title="Title"
        uiParams={{
          columns: [{
            title: 'name',
            dataIndex: 'name',
            key: 'name'
          }]
        }}
      >
        <string keyName="name" title="Name" />
      </array>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  });

  it('integration 2', () => {
    var contactInfo = [
      {
        key: 'phones',
        options: [{
          text: 'Home',
          value: 'HOME'
        }, {
          text: 'Company',
          value: 'COMPANY'
        }, {
          text: 'Mobile',
          value: 'MOBILE'
        }]
      },
      {
        key: 'addresses',
        options: [{
          text: 'Home',
          value: 'HOME'
        }, {
          text: 'Company',
          value: 'COMPANY'
        }]
      },
      {
        key: 'emails',
        options: []
      }
    ]
    const Img = ({attributes}) => (
      <object keyName={attributes.keyName} title={attributes.title}>
        <string keyName="imageName" title="imageName" />
        <file keyName="imageSrc" title="imageSrc" contentType="images/*" />
      </object>
    );
    const {schema, visitors} = <root>
      <object keyName="info" title="MyInfo">
        <Block>
          <Block keyName="name">
          {/* <file keyName="thumbnail" title="Thumbnail" contentType="image/*" ui="image"/> */}
          <string keyName="name" title="Name"/>
          <string keyName="nickname" title="Nickname" />
          </Block>
          <string keyName="test" title="321" />
          <Img keyName="thumbnail" title="Photo" />
          <object keyName="contactInfo" title="ContactInfo">
          {
            contactInfo.map(info => (
              <array ui="table" keyName={info.key} key={info.key} uiParams={{
                columns: [{
                  title: 'Type',
                  dataIndex: 'type'
                }, {
                  title: 'Value',
                  dataIndex: 'value'
                }]
              }}>
                {
                  info && <string ui="select" 
                    uiParams={{options: info.options}}
                    keyName="type"
                  />
                }
                <string keyName="value"/>
              </array>
            ))
          }
          </object>
        </Block>
      </object>
    </root>;
    expect(compile(schema, visitors)).toMatchSnapshot();
  })
})